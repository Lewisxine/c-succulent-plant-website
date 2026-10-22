import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Supabase Storage 公共图片域名白名单。
  // 当前项目渲染日记图片用的是原生 <img>（见 DiaryImage 组件），并不需要
  // 此配置；这里是为将来改用 next/image 预留，避免外部图片被 400 拦截。
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ijjuuzifhlixlnfmlpcl.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
        search: "",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
