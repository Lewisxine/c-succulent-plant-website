export interface VerifiedName {
  canonicalName: string;
  authority: string | null;
}

/**
 * 用 GBIF（全球生物多样性信息设施，免费、无需 Key）核验拉丁学名。
 * 仅当返回 EXACT（精确匹配）时视为核验通过，返回规范名与命名人；
 * 其它情况（查无 / 近似 / 仅匹配到更高阶元 / 网络错误）返回 null。
 */
export async function verifyScientificName(
  name: string
): Promise<VerifiedName | null> {
  const url = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(
    name
  )}&kingdom=Plantae`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      matchType?: string;
      canonicalName?: string;
      scientificName?: string;
      authorship?: string;
    };
    if (!json || json.matchType !== "EXACT") return null;

    const canonicalName = json.canonicalName || json.scientificName || name;

    // 优先用 authorship；否则从完整名（如 "Haworthia cooperi Baker"）里
    // 去掉规范名，剩下的部分当作命名人。
    let authority: string | null = null;
    if (typeof json.authorship === "string" && json.authorship.trim()) {
      authority = json.authorship.trim();
    } else if (
      typeof json.scientificName === "string" &&
      json.scientificName.startsWith(canonicalName)
    ) {
      const rest = json.scientificName.slice(canonicalName.length).trim();
      if (rest) authority = rest;
    }

    return { canonicalName, authority };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
