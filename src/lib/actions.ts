"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

  const { error: insertError } = await supabase.from("diary_entries").insert({
    user_id: user.id,
    title,
    content,
    mood,
    growth_status: growthStatus,
    image_url: imageUrl,
  });

  if (insertError) {
    return { error: insertError.message };
  }

  revalidatePath(`/${locale}/diary`);
  return { success: true };
}
