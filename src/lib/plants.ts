export type Difficulty = "easy" | "medium" | "hard";
export type LightLevel = "full" | "partial" | "low";

export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Succulent {
  slug: string;
  scientificName: string;
  commonName: LocalizedText;
  family: LocalizedText;
  genus: string;
  image: string;
  difficulty: Difficulty;
  light: LightLevel;
  description: LocalizedText;
  environment: LocalizedText;
  temperature: LocalizedText;
  watering: LocalizedText;
  growthCycle: LocalizedText;
  care: LocalizedText;
}

export const succulents: Succulent[] = [
  {
    slug: "bear-paw",
    scientificName: "Cotyledon tomentosa",
    commonName: { zh: "熊童子", en: "Bear's Paw" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Cotyledon",
    image: "/images/plants/bear-paw.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "叶片肥厚、顶端有齿状突起，像小熊的爪子，因此得名。表面覆有细密绒毛，摸起来软软的。",
      en: "Its chubby leaves are topped with tooth-like tips that look like a bear's paw, and are covered in a soft fuzz.",
    },
    environment: {
      zh: "喜温暖干燥、阳光充足的环境。春秋季可全日照，夏季适当遮阴，通风要良好。",
      en: "Prefers warm, dry and sunny conditions. Full sun in spring and autumn; light shade and good airflow in summer.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃，避免霜冻。",
      en: "Grows best at 15–25°C; keep above 5°C in winter and avoid frost.",
    },
    watering: {
      zh: "干透浇透。春秋生长季每周一次，夏季控水，冬季保持盆土微干。",
      en: "Water thoroughly only when the soil is dry: weekly in the growing season, less in summer, nearly dry in winter.",
    },
    growthCycle: {
      zh: "春秋为生长期，夏季高温进入半休眠，生长缓慢。",
      en: "Grows in spring and autumn; semi-dormant during hot summers.",
    },
    care: {
      zh: "使用疏松透气的颗粒土，避免叶面长期沾水（绒毛易积水腐烂）。可叶插或扦插繁殖。",
      en: "Use gritty, well-draining soil and keep water off the fuzzy leaves. Propagate by leaf or stem cuttings.",
    },
  },
  {
    slug: "haworthia-cooperi",
    scientificName: "Haworthia cooperi",
    commonName: { zh: "玉露", en: "Cooper's Haworthia" },
    family: { zh: "阿福花科", en: "Asphodelaceae" },
    genus: "Haworthia",
    image: "/images/plants/haworthia-cooperi.jpg",
    difficulty: "easy",
    light: "low",
    description: {
      zh: "叶片顶端透明如水晶，被称为「窗」，可以透光进行光合作用，是十二卷属中的经典品种。",
      en: "The leaf tips are translucent 'windows' that let light in for photosynthesis — a classic of the Haworthia group.",
    },
    environment: {
      zh: "喜明亮散射光，不耐强光直射，非常适合室内窗台养护。空气湿度略高时窗面更透亮。",
      en: "Prefers bright, indirect light and dislikes harsh sun, making it ideal for indoor windowsills.",
    },
    temperature: {
      zh: "生长适温 15–28℃，冬季不低于 5℃。",
      en: "Grows at 15–28°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "保持盆土微润但不积水，春秋略勤，夏季减少，冬季偏干。",
      en: "Keep soil lightly moist but never soggy; water a bit more in spring/autumn and less in summer/winter.",
    },
    growthCycle: {
      zh: "春秋为生长期，夏季高温短暂休眠，冬季生长缓慢。",
      en: "Grows in spring and autumn; brief summer dormancy and slow winter growth.",
    },
    care: {
      zh: "用泥炭加颗粒的疏松基质，散射光即可。可分株或叶插繁殖，换盆在春秋进行。",
      en: "Use a loose peat-and-grit mix, keep in indirect light, and propagate by offsets or leaf cuttings.",
    },
  },
  {
    slug: "lithops",
    scientificName: "Lithops spp.",
    commonName: { zh: "生石花", en: "Living Stones" },
    family: { zh: "番杏科", en: "Aizoaceae" },
    genus: "Lithops",
    image: "/images/plants/lithops.jpg",
    difficulty: "medium",
    light: "full",
    description: {
      zh: "外形酷似鹅卵石，是著名的「拟态植物」，会在石头间开出一朵小花，非常有趣。",
      en: "Masters of camouflage, these mimic pebbles and push a single flower up between the two leaves.",
    },
    environment: {
      zh: "需要充足光照和极度干燥的环境，怕积水，适合朝南阳台。",
      en: "Needs strong light and very dry conditions; hates standing water and suits a south-facing spot.",
    },
    temperature: {
      zh: "生长适温 18–25℃，耐高温，冬季保持 5℃ 以上。",
      en: "Grows at 18–25°C; tolerates heat, keep above 5°C in winter.",
    },
    watering: {
      zh: "浇水量极少。生长期土干透再浇，蜕皮期（冬春）完全断水。",
      en: "Water very sparingly — only when fully dry during growth, and stop completely while shedding (winter–spring).",
    },
    growthCycle: {
      zh: "春秋生长，夏季休眠，冬季开始蜕皮，新叶从旧叶中长出。",
      en: "Grows in spring/autumn, rests in summer, and sheds old leaves in winter as new ones emerge.",
    },
    care: {
      zh: "用纯颗粒土保证排水，宁干勿湿。蜕皮期切忌浇水，开花后及时摘残花。",
      en: "Use pure gritty mix, err on the dry side, never water while shedding, and remove spent flowers.",
    },
  },
  {
    slug: "jelly-bean",
    scientificName: "Sedum rubrotinctum",
    commonName: { zh: "虹之玉", en: "Jelly Bean Plant" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Sedum",
    image: "/images/plants/jelly-bean.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "一粒粒圆润的叶片像糖豆，日照充足时由绿转红，是极好养的新手入门品种。",
      en: "Plump little jelly-bean leaves turn from green to red in strong sun — a perfect beginner plant.",
    },
    environment: {
      zh: "喜阳光充足，春秋全日照能让叶片上色，夏季适当遮阴。",
      en: "Loves full sun to bring out its colour; light shade in the hottest summer.",
    },
    temperature: {
      zh: "生长适温 10–28℃，较耐寒，冬季短时 0℃ 左右也能耐受。",
      en: "Grows at 10–28°C and is fairly cold-tolerant, briefly handling around 0°C.",
    },
    watering: {
      zh: "干透浇透，生长期每周一次，冬季减少并保持干燥。",
      en: "Water thoroughly when dry, weekly in the growing season, much less in winter.",
    },
    growthCycle: {
      zh: "春秋旺盛生长，夏季缓慢，冬季低温下基本停止生长。",
      en: "Grows strongly in spring/autumn, slows in summer, and nearly stops in cold winters.",
    },
    care: {
      zh: "叶片易脱落，可掉叶生根繁殖。土壤需疏松透气，避免长期潮湿。",
      en: "Dropped leaves root easily. Use loose, well-draining soil and avoid prolonged wetness.",
    },
  },
  {
    slug: "echeveria-chihuahuaensis",
    scientificName: "Echeveria chihuahuaensis",
    commonName: { zh: "吉娃莲", en: "Echeveria 'Chihuahuaensis'" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Echeveria",
    image: "/images/plants/echeveria-chihuahuaensis.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "莲座状排列的叶片带红尖，像一朵永不凋谢的花，是拟石莲花属中的人气品种。",
      en: "A rosette of leaves with red tips, like a flower that never fades — a favourite among Echeverias.",
    },
    environment: {
      zh: "喜阳光充足、干燥通风，春秋可全日照，夏季高温适当遮阴。",
      en: "Prefers bright, dry, well-ventilated spots; full sun in spring/autumn, shade in peak summer.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，沿盆边浇水，避免浇到叶心导致腐烂。",
      en: "Water thoroughly when dry, pouring around the rim and keeping water out of the rosette centre.",
    },
    growthCycle: {
      zh: "春秋为生长期，夏季半休眠，冬季低温生长缓慢。",
      en: "Grows in spring/autumn, semi-dormant in summer, slow in winter.",
    },
    care: {
      zh: "使用颗粒土，光照充足时叶尖更红。可叶插或砍头繁殖。",
      en: "Use gritty soil; strong light deepens the red tips. Propagate by leaf or beheading.",
    },
  },
  {
    slug: "moonstone",
    scientificName: "Pachyphytum oviferum",
    commonName: { zh: "桃美人", en: "Moonstone" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Pachyphytum",
    image: "/images/plants/moonstone.jpg",
    difficulty: "medium",
    light: "full",
    description: {
      zh: "叶片圆滚滚、呈淡粉色，表面有一层白粉，像一颗颗小桃子，十分可爱。",
      en: "Round, powdery-pink leaves look like little peaches — one of the cutest succulents around.",
    },
    environment: {
      zh: "喜阳光充足、干燥通风，光照不足会变绿、徒长。",
      en: "Needs bright, dry, airy conditions; without enough light it turns green and leggy.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，宁干勿湿，避免破坏叶片白粉。",
      en: "Water thoroughly only when dry; avoid touching the powdery bloom on the leaves.",
    },
    growthCycle: {
      zh: "春秋生长，夏季高温半休眠，冬季缓慢。",
      en: "Grows in spring/autumn, semi-dormant in hot summer, slow in winter.",
    },
    care: {
      zh: "叶片白粉有保护作用，尽量不擦。可叶插或扦插繁殖。",
      en: "The white bloom protects the plant — try not to wipe it off. Propagate by leaf or cuttings.",
    },
  },
  {
    slug: "string-of-pearls",
    scientificName: "Curio rowleyanus",
    commonName: { zh: "佛珠", en: "String of Pearls" },
    family: { zh: "菊科", en: "Asteraceae" },
    genus: "Curio",
    image: "/images/plants/string-of-pearls.jpg",
    difficulty: "medium",
    light: "partial",
    description: {
      zh: "一颗颗球形叶片串成珠帘，垂吊生长，是广受欢迎的观叶多肉。",
      en: "Spherical leaves form beaded strands that trail gracefully — a much-loved hanging succulent.",
    },
    environment: {
      zh: "喜明亮散射光，忌强光直晒，适合室内或半阴处垂吊养护。",
      en: "Prefers bright, indirect light and dislikes harsh sun; ideal for hanging indoors or in part shade.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "避免积水，土表干后再浇。夏季高温休眠时控水。",
      en: "Avoid soggy soil; water when the surface is dry, and water less during summer dormancy.",
    },
    growthCycle: {
      zh: "春秋旺盛生长并抽出新珠串，夏季高温休眠。",
      en: "Grows and pushes out new strands in spring/autumn; dormant in hot summers.",
    },
    care: {
      zh: "用透气基质，盆底排水良好。可剪取枝条扦插，浅埋生根。",
      en: "Use airy mix with good drainage; take stem cuttings and lay them on soil to root.",
    },
  },
  {
    slug: "black-rose",
    scientificName: "Aeonium arboreum 'Zwartkop'",
    commonName: { zh: "黑法师", en: "Black Rose Aeonium" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Aeonium",
    image: "/images/plants/black-rose.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "深紫近黑的莲座状叶片，像一朵神秘的玫瑰，极具观赏性。",
      en: "Deep purple, almost black rosettes look like mysterious roses — striking and sculptural.",
    },
    environment: {
      zh: "喜阳光充足、凉爽干燥，光照不足叶色会变绿。",
      en: "Prefers bright, cool and dry conditions; leaves turn green without enough light.",
    },
    temperature: {
      zh: "生长适温 15–25℃，不耐严寒，冬季保持 5℃ 以上。",
      en: "Grows at 15–25°C; not frost-hardy, keep above 5°C in winter.",
    },
    watering: {
      zh: "春秋生长期干透浇透，夏季休眠期严格控水。",
      en: "Water thoroughly when dry in spring/autumn; water very little during summer dormancy.",
    },
    growthCycle: {
      zh: "春秋生长，夏季高温休眠，叶片会包拢。",
      en: "Grows in spring/autumn; in summer it goes dormant and the rosettes close up.",
    },
    care: {
      zh: "通风要好，避免夏季闷热积水。可扦插或分株繁殖。",
      en: "Keep well ventilated and avoid summer rot; propagate by cuttings or offsets.",
    },
  },
  {
    slug: "string-of-buttons",
    scientificName: "Crassula perforata",
    commonName: { zh: "钱串", en: "String of Buttons" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Crassula",
    image: "/images/plants/string-of-buttons.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "叶片对生、层层叠叠像一串串铜钱，茎干直立，生长迅速。",
      en: "Opposite leaves stack like strings of coins on upright stems — fast-growing and rewarding.",
    },
    environment: {
      zh: "喜阳光充足，光照充足时叶缘泛红，耐半阴。",
      en: "Loves full sun (which blushes the leaf edges) but tolerates part shade.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，生长期略勤，冬季控水。",
      en: "Water thoroughly when dry, more in the growing season and sparingly in winter.",
    },
    growthCycle: {
      zh: "春秋生长，夏季高温半休眠，冬季缓慢。",
      en: "Grows in spring/autumn, semi-dormant in hot summer, slow in winter.",
    },
    care: {
      zh: "易徒长，注意控水并保证光照。可枝插繁殖，极易成活。",
      en: "Prone to stretching — control water and give good light. Stem cuttings root very easily.",
    },
  },
  {
    slug: "jade-plant",
    scientificName: "Crassula ovata",
    commonName: { zh: "玉树", en: "Jade Plant" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Crassula",
    image: "/images/plants/jade-plant.jpg",
    difficulty: "easy",
    light: "partial",
    description: {
      zh: "木质化茎干上长满油亮的厚叶片，是经典的老牌多肉，象征吉祥。",
      en: "A classic with glossy, thick leaves on woody stems — long-lived and symbolic of good fortune.",
    },
    environment: {
      zh: "喜阳光，也能耐半阴，适应性极强，室内外皆可。",
      en: "Likes sun but tolerates part shade; extremely adaptable indoors or out.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，冬季控水，宁干勿湿。",
      en: "Water thoroughly when dry, sparingly in winter — err on the dry side.",
    },
    growthCycle: {
      zh: "春秋生长，夏季缓慢，冬季低温几乎停止。",
      en: "Grows in spring/autumn, slows in summer, and nearly stops in cold winters.",
    },
    care: {
      zh: "耐修剪，可塑造成小盆景。叶插、枝插都易成活。",
      en: "Tolerates pruning and can be shaped as a bonsai. Leaf and stem cuttings root easily.",
    },
  },
  {
    slug: "zebra-plant",
    scientificName: "Haworthiopsis fasciata",
    commonName: { zh: "条纹十二卷", en: "Zebra Plant" },
    family: { zh: "阿福花科", en: "Asphodelaceae" },
    genus: "Haworthiopsis",
    image: "/images/plants/zebra-plant.jpg",
    difficulty: "easy",
    light: "low",
    description: {
      zh: "叶片上布满白色横纹，像斑马纹，是耐阴好养的室内多肉。",
      en: "White horizontal stripes like a zebra make this a forgiving, shade-tolerant indoor succulent.",
    },
    environment: {
      zh: "喜明亮散射光，忌暴晒，适合室内桌面、窗边。",
      en: "Prefers bright, indirect light and dislikes scorching sun; great for desks and windowsills.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，避免积水，冬季减少浇水。",
      en: "Water thoroughly when dry, avoid standing water, and water less in winter.",
    },
    growthCycle: {
      zh: "春秋生长，夏季高温休眠，冬季缓慢。",
      en: "Grows in spring/autumn, dormant in hot summers, slow in winter.",
    },
    care: {
      zh: "易萌生侧芽，可及时分株繁殖。散射光下条纹更清晰。",
      en: "Readily produces offsets to divide; indirect light keeps the stripes crisp.",
    },
  },
  {
    slug: "pearl-of-nurnberg",
    scientificName: "Echeveria 'Perle von Nürnberg'",
    commonName: { zh: "紫珍珠", en: "Pearl of Nürnberg" },
    family: { zh: "景天科", en: "Crassulaceae" },
    genus: "Echeveria",
    image: "/images/plants/pearl-of-nurnberg.jpg",
    difficulty: "easy",
    light: "full",
    description: {
      zh: "淡紫粉色的莲座叶片带珍珠光泽，是最受欢迎的杂交拟石莲花之一。",
      en: "Lavender-pink rosettes with a pearly sheen — one of the most popular hybrid Echeverias.",
    },
    environment: {
      zh: "喜阳光充足、干燥通风，光照不足会褪色徒长。",
      en: "Needs bright, dry, airy conditions; without enough light it fades and stretches.",
    },
    temperature: {
      zh: "生长适温 15–25℃，冬季不低于 5℃。",
      en: "Grows at 15–25°C; keep above 5°C in winter.",
    },
    watering: {
      zh: "干透浇透，沿盆边浇水，避免叶心积水。",
      en: "Water thoroughly when dry, pouring around the rim and keeping the centre dry.",
    },
    growthCycle: {
      zh: "春秋生长，夏季半休眠，冬季缓慢。",
      en: "Grows in spring/autumn, semi-dormant in summer, slow in winter.",
    },
    care: {
      zh: "使用颗粒土，充足光照能保持紫色。可叶插或砍头繁殖。",
      en: "Use gritty soil; strong light keeps the purple colour. Propagate by leaf or beheading.",
    },
  },
];

export function getSucculent(slug: string): Succulent | undefined {
  return succulents.find((s) => s.slug === slug);
}

// ---- 用户投稿词条（存在 Supabase `plants` 表） ----

export const CARE_DIFFICULTIES: { value: Difficulty; emoji: string }[] = [
  { value: "easy", emoji: "🌱" },
  { value: "medium", emoji: "🌿" },
  { value: "hard", emoji: "🌵" },
];

export type PlantStatus = "pending" | "approved" | "rejected";

export interface PlantSubmission {
  id: string;
  created_by: string;
  name_zh: string;
  name_en: string | null;
  scientific_name: string | null;
  scientific_name_authority: string | null;
  scientific_name_verified: boolean;
  family_zh: string | null;
  family_en: string | null;
  genus_zh: string | null;
  genus_en: string | null;
  growth_habit_zh: string | null;
  growth_habit_en: string | null;
  description_zh: string | null;
  description_en: string | null;
  care_difficulty: Difficulty;
  image_url: string | null;
  status: PlantStatus;
  created_at: string;
}

/** 按当前语言取双语字段，目标语言缺失时回退到另一语言。 */
export function pickLocale(
  zh: string | null | undefined,
  en: string | null | undefined,
  locale: string
): string {
  if (locale === "en") return en ?? zh ?? "";
  return zh ?? en ?? "";
}
