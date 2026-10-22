"use client";

import { useState } from "react";

interface DiaryImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Renders a diary photo with an error fallback. If the image fails to load
 * (e.g. the storage bucket is private and the public URL returns 403), we
 * show a neutral placeholder instead of a broken image icon.
 */
export default function DiaryImage({
  src,
  alt,
  className,
  fallbackClassName,
}: DiaryImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`flex items-center justify-center bg-cream-100 text-leaf-400 ${
          fallbackClassName ?? ""
        }`}
        role="img"
        aria-label={alt}
      >
        <span className="text-4xl" aria-hidden>
          🌵
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
}
