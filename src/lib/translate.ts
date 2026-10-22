export type Lang = "zh" | "en";

/** 通过是否包含 CJK 字符粗略判断文本语言（用于确定翻译方向）。 */
export function detectLanguage(text: string): Lang {
  return /[\u4e00-\u9fff]/.test(text) ? "zh" : "en";
}

/** 解码 MyMemory 返回中常见的 HTML 实体。 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)));
}

/**
 * 用 MyMemory（免费、无需 Key）把 text 翻译到 target 语言。
 * 翻译失败或结果语言不对时返回 null，调用方据此回退到源语言。
 */
export async function translateText(
  text: string,
  target: Lang
): Promise<string | null> {
  const source: Lang = target === "en" ? "zh" : "en";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    text
  )}&langpair=${source}|${target}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      responseData?: { translatedText?: unknown };
    };
    const translated = json?.responseData?.translatedText;
    if (typeof translated !== "string") return null;

    const cleaned = decodeEntities(translated).trim();
    if (!cleaned) return null;

    // 校验结果语言：翻成英文则不应含中文；翻成中文则应含中文。
    if (target === "en" && /[\u4e00-\u9fff]/.test(cleaned)) return null;
    if (target === "zh" && !/[\u4e00-\u9fff]/.test(cleaned)) return null;

    return cleaned;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export interface LocalizedPair {
  zh: string | null;
  en: string | null;
}

/**
 * 把一个单语言字段翻成中英双语。
 * source 为输入语言；目标语言翻译失败时对应字段置 null，
 * 展示层用 pickLocale 回退到源语言。
 */
export async function localizeField(
  text: string | null,
  source: Lang
): Promise<LocalizedPair> {
  if (!text) return { zh: null, en: null };
  const target: Lang = source === "zh" ? "en" : "zh";
  const translated = await translateText(text, target);
  return source === "zh"
    ? { zh: text, en: translated }
    : { zh: translated, en: text };
}
