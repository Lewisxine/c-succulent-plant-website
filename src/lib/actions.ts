"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { detectLanguage, localizeField } from "@/lib/translate";
import { verifyScientificName } from "@/lib/verify-name";

export type CreateDiaryResult = { success: true } | { error: string };

export async function createDiaryEntry(
  formData: FormData,
  locale: string
): Promise<CreateDiaryResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not-authenticated" };
  }

  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const mood = (formData.get("mood") as string) || null;
  const growthStatus = (formData.get("growth_status") as string) || null;
  const isPublic = formData.get("is_public") === "true";
  const file = formData.get("image") as File | null;

  if (!title) {
    return { error: "missing-title" };
  }

  let imageUrl: string | null = null;

  if (file && file.size > 0) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return { error: "file-too-large" };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("diary-images")
      .upload(filename, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("diary-images")
      .getPublicUrl(filename);
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase.from("diaries").insert({
    user_id: user.id,
    title,
    content,
    mood,
    growth_status: growthStatus,
    image_url: imageUrl,
    is_public: isPublic,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/${locale}/diary`);
  return { success: true };
}

export type DeleteDiaryResult = { success: true } | { error: string };

export async function deleteDiaryEntry(
  diaryId: string,
  locale: string
): Promise<DeleteDiaryResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not-authenticated" };
  }

  // RLS (`diaries_delete_own`) ensures only auth.uid() = user_id can delete.
  const { error } = await supabase
    .from("diaries")
    .delete()
    .eq("id", diaryId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/${locale}/diary`);
  revalidatePath(`/${locale}/explore`);
  return { success: true };
}

export type UpdateProfileResult = { success: true } | { error: string };

export async function updateProfile(
  formData: FormData,
  locale: string
): Promise<UpdateProfileResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not-authenticated" };
  }

  const nickname = (formData.get("nickname") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;

  const yearsRaw = (formData.get("succulent_years") as string)?.trim();
  const succulentYears = yearsRaw ? Number(yearsRaw) : null;

  if (nickname && nickname.length > 30) {
    return { error: "nickname-too-long" };
  }
  if (
    succulentYears !== null &&
    (!Number.isInteger(succulentYears) || succulentYears < 0 || succulentYears > 100)
  ) {
    return { error: "invalid-years" };
  }

  let avatarUrl = (formData.get("avatar_url") as string)?.trim() || null;
  const file = formData.get("avatar") as File | null;

  if (file && file.size > 0) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return { error: "file-too-large" };
    }

    // 固定文件名，覆盖式上传：每次保存都覆盖同一对象，避免头像文件无限堆积。
    const filename = `${user.id}/avatar`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filename, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filename);
    // 附加时间戳 query 跳过浏览器/CDN 缓存，让新头像保存后立即生效
    avatarUrl = `${publicUrlData.publicUrl}?v=${Date.now()}`;
  }

  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: user.id,
    nickname,
    succulent_years: succulentYears,
    avatar_url: avatarUrl,
    bio,
  });

  if (upsertError) {
    return { error: upsertError.message };
  }

  revalidatePath(`/${locale}/profile`);
  return { success: true };
}

export type CreatePlantResult = { success: true } | { error: string };

export async function createPlantEntry(
  formData: FormData,
  locale: string
): Promise<CreatePlantResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "not-authenticated" };
  }

  const name = (formData.get("name") as string)?.trim();
  const scientificName = (formData.get("scientific_name") as string)?.trim() || null;
  const family = (formData.get("family") as string)?.trim() || null;
  const genus = (formData.get("genus") as string)?.trim() || null;
  const growthHabit = (formData.get("growth_habit") as string)?.trim() || null;
  const careDifficulty = (formData.get("care_difficulty") as string) || "medium";
  const description = (formData.get("description") as string)?.trim() || null;
  const file = formData.get("image") as File | null;

  if (!name) {
    return { error: "missing-name" };
  }

  // 1) 语言检测：以名称等文本判断，兜底用提交时的 locale。
  const source = detectLanguage(
    name || family || genus || growthHabit || description || (locale === "en" ? "en" : "zh")
  );

  // 2) 自动翻译成中英双语（翻译失败时对应语言为 null，展示层回退到源语言）。
  const [namePair, familyPair, genusPair, habitPair, descPair] = await Promise.all([
    localizeField(name, source),
    localizeField(family, source),
    localizeField(genus, source),
    localizeField(growthHabit, source),
    localizeField(description, source),
  ]);

  // 3) 学名校验：GBIF 精确匹配才标记为已核验，并写回规范名与命名人。
  let scientificNameVerified = false;
  let canonicalName = scientificName;
  let authority: string | null = null;
  if (scientificName) {
    const verified = await verifyScientificName(scientificName);
    if (verified) {
      scientificNameVerified = true;
      canonicalName = verified.canonicalName;
      authority = verified.authority;
    }
  }

  let imageUrl: string | null = null;

  if (file && file.size > 0) {
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      return { error: "file-too-large" };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("plant-images")
      .upload(filename, file, { upsert: false, contentType: file.type });

    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("plant-images")
      .getPublicUrl(filename);
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: insertError } = await supabase.from("plants").insert({
    created_by: user.id,
    name_zh: namePair.zh,
    name_en: namePair.en,
    scientific_name: canonicalName,
    scientific_name_authority: authority,
    scientific_name_verified: scientificNameVerified,
    family_zh: familyPair.zh,
    family_en: familyPair.en,
    genus_zh: genusPair.zh,
    genus_en: genusPair.en,
    growth_habit_zh: habitPair.zh,
    growth_habit_en: habitPair.en,
    description_zh: descPair.zh,
    description_en: descPair.en,
    care_difficulty: careDifficulty,
    image_url: imageUrl,
    status: "pending",
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/${locale}/plants`);
  revalidatePath(`/${locale}/plants/mine`);
  return { success: true };
}
