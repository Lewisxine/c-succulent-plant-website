"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { updateProfile } from "@/lib/actions";

interface ProfileFormProps {
  initialNickname: string | null;
  initialSucculentYears: number | null;
  initialAvatarUrl: string | null;
  initialBio: string | null;
}

export default function ProfileForm({
  initialNickname,
  initialSucculentYears,
  initialAvatarUrl,
  initialBio,
}: ProfileFormProps) {
  const t = useTranslations("profile");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [nickname, setNickname] = useState(initialNickname ?? "");
  const [succulentYears, setSucculentYears] = useState(
    initialSucculentYears != null ? String(initialSucculentYears) : ""
  );
  const [bio, setBio] = useState(initialBio ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  function setPreviewUrl(url: string | null) {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = url;
    setPreview(url);
  }

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreviewUrl(URL.createObjectURL(f));
  }

  function removeAvatar() {
    setPreviewUrl(null);
    setAvatarUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSaved(false);

    const formData = new FormData(e.currentTarget);
    formData.set("succulent_years", succulentYears.trim());
    if (avatarUrl) {
      formData.set("avatar_url", avatarUrl);
    }

    const result = await updateProfile(formData, locale);
    setSubmitting(false);

    if ("error" in result) {
      setError(t("errorSave"));
      return;
    }

    setSaved(true);
    router.refresh();
  }

  const shownAvatar = preview ?? avatarUrl;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div>
        <label
          htmlFor="profile-avatar"
          className="mb-2 block text-sm font-semibold text-leaf-700"
        >
          {t("avatarLabel")}
        </label>

        <input
          id="profile-avatar"
          ref={fileInputRef}
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-leaf-200 bg-cream-100">
            {shownAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={shownAvatar}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-3xl" aria-hidden>
                🌵
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="profile-avatar"
              className="cursor-pointer rounded-full border border-leaf-200 px-4 py-2 text-sm font-medium text-leaf-700 transition-colors hover:bg-leaf-100"
            >
              {t("avatarHint")}
            </label>
            {shownAvatar && (
              <button
                type="button"
                onClick={removeAvatar}
                className="text-left text-sm font-medium text-red-600"
              >
                {t("avatarRemove")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Nickname */}
      <div>
        <label
          htmlFor="profile-nickname"
          className="mb-2 block text-sm font-semibold text-leaf-700"
        >
          {t("nicknameLabel")}
        </label>
        <input
          id="profile-nickname"
          name="nickname"
          maxLength={30}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={t("nicknamePlaceholder")}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {/* Succulent years */}
      <div>
        <label
          htmlFor="profile-years"
          className="mb-2 block text-sm font-semibold text-leaf-700"
        >
          {t("yearsLabel")}
        </label>
        <input
          id="profile-years"
          name="succulent_years"
          type="number"
          min={0}
          max={100}
          value={succulentYears}
          onChange={(e) => setSucculentYears(e.target.value)}
          placeholder={t("yearsPlaceholder")}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="profile-bio"
          className="mb-2 block text-sm font-semibold text-leaf-700"
        >
          {t("bioLabel")}
        </label>
        <textarea
          id="profile-bio"
          name="bio"
          rows={3}
          maxLength={200}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder={t("bioPlaceholder")}
          className="w-full rounded-2xl border-2 border-leaf-200 bg-white px-4 py-3 text-leaf-800 placeholder:text-leaf-400 focus:border-leaf-400 focus:outline-none"
        />
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {saved && (
        <p className="rounded-2xl bg-leaf-50 px-4 py-3 text-sm text-leaf-700">
          {t("saved")}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-leaf-500 px-6 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-leaf-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? t("saving") : t("save")}
      </button>
    </form>
  );
}
