import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "多肉小百科 · Succulent Guide",
    template: "%s · 多肉小百科",
  },
  description:
    "面向中国多肉爱好者的科普与日记网站：学名、常见名、存活环境、生长周期与照顾方式，以及属于你的多肉日记。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" className="h-full">
      <body className="flex min-h-full flex-col antialiased">{children}</body>
    </html>
  );
}
