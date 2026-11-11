import type { NextConfig } from "next";

const apiHost = (process.env.NEXT_PUBLIC_API_HOST || "https://backend-final-web-xbbs.onrender.com").replace(
  /\/+$/,
  "",
);

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiHost}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
