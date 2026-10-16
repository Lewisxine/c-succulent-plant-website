import type { LocalizedText } from "./plants";

export function localized(text: LocalizedText, locale: string): string {
  return locale === "en" ? text.en : text.zh;
}
