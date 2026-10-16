export interface DiaryOption {
  value: string;
  emoji: string;
}

export const MOODS: DiaryOption[] = [
  { value: "happy", emoji: "😊" },
  { value: "calm", emoji: "😌" },
  { value: "excited", emoji: "🤩" },
  { value: "proud", emoji: "🥰" },
  { value: "worried", emoji: "😟" },
  { value: "tired", emoji: "😪" },
];

export const GROWTH_STATUSES: DiaryOption[] = [
  { value: "sprouting", emoji: "🌱" },
  { value: "growing", emoji: "🌿" },
  { value: "thriving", emoji: "🌵" },
  { value: "dormant", emoji: "😴" },
  { value: "struggling", emoji: "🥀" },
];

export interface DiaryEntry {
  id: string;
  user_id: string;
  image_url: string | null;
  mood: string | null;
  growth_status: string | null;
  title: string;
  content: string;
  created_at: string;
}
