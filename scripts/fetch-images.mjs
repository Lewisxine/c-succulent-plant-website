import { writeFileSync, mkdirSync } from "node:fs";

const UA = "SucculentGuide/1.0 (educational website)";

const plants = [
  { slug: "bear-paw", name: "Cotyledon tomentosa" },
  { slug: "haworthia-cooperi", name: "Haworthia cooperi" },
  { slug: "lithops", name: "Lithops" },
  { slug: "jelly-bean", name: "Sedum rubrotinctum" },
  { slug: "echeveria-chihuahuaensis", name: "Echeveria chihuahuaensis" },
  { slug: "moonstone", name: "Pachyphytum oviferum" },
  { slug: "string-of-pearls", name: "Curio rowleyanus" },
  { slug: "black-rose", name: "Aeonium arboreum Zwartkop" },
  { slug: "string-of-buttons", name: "Crassula perforata" },
  { slug: "jade-plant", name: "Crassula ovata" },
  { slug: "zebra-plant", name: "Haworthiopsis fasciata" },
  { slug: "pearl-of-nurnberg", name: "Echeveria Perle von Nurnberg" },
];

const BAD = /(map|diagram|distribution|icon|logo|flag|coat of arms|chart|graph)/i;

function stripHtml(s) {
  return (s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function searchCommons(query) {
  const url =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      generator: "search",
      gsrsearch: `filetype:bitmap ${query}`,
      gsrnamespace: "6",
      gsrlimit: "8",
      prop: "imageinfo",
      iiprop: "url|extmetadata",
      iiurlwidth: "1200",
      origin: "*",
    });
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  const json = await res.json();
  const pages = json?.query?.pages ?? {};
  return Object.values(pages)
    .filter((p) => p?.imageinfo?.[0])
    .map((p) => ({ title: p.title, info: p.imageinfo[0] }));
}

function pickBest(results) {
  for (const r of results) {
    if (!BAD.test(r.title)) return r;
  }
  return results[0];
}

async function main() {
  mkdirSync("public/images/plants", { recursive: true });
  const sources = [];

  for (const plant of plants) {
    try {
      const results = await searchCommons(plant.name);
      const best = pickBest(results);
      if (!best) {
        console.log("MISS  ", plant.slug);
        continue;
      }

      const info = best.info;
      const thumburl = info.thumburl || info.url;
      const artist = stripHtml(info.extmetadata?.Artist?.value);
      const license = info.extmetadata?.LicenseShortName?.value || "";
      const fileTitle = best.title.replace(/^File:/, "").replace(/ /g, "_");
      const filePage = `https://commons.wikimedia.org/wiki/File:${fileTitle}`;

      const imgRes = await fetch(thumburl, { headers: { "User-Agent": UA } });
      if (!imgRes.ok) {
        console.log("FAIL  ", plant.slug, imgRes.status);
        continue;
      }
      const buf = Buffer.from(await imgRes.arrayBuffer());
      writeFileSync(`public/images/plants/${plant.slug}.jpg`, buf);

      sources.push({ slug: plant.slug, name: plant.name, filePage, artist, license });
      console.log("OK    ", plant.slug, "(", license, ")", best.title);

      await new Promise((r) => setTimeout(r, 300));
    } catch (e) {
      console.log("ERROR ", plant.slug, e.message);
    }
  }

  let md = "# 图片来源 · Image Sources\n\n";
  md +=
    "本站所有多肉植物图片均来自 Wikimedia Commons 的真实摄影作品，非 AI 生成。\n";
  md +=
    "All plant photos are real photography from Wikimedia Commons, never AI-generated.\n\n";
  for (const s of sources) {
    md += `## ${s.slug} — ${s.name}\n`;
    md += `- 来源 Source: ${s.filePage}\n`;
    md += `- 作者 Author: ${s.artist || "未知 unknown"}\n`;
    md += `- 许可 License: ${s.license || "见来源页 see source"}\n\n`;
  }
  writeFileSync("IMAGE_SOURCES.md", md);
  console.log("\nWrote IMAGE_SOURCES.md with", sources.length, "entries");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
