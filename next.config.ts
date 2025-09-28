import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "v5j7rrl9-3000.inc1.devtunnels.ms",
        "https://v5j7rrl9-3001.inc1.devtunnels.ms",
        "v5j7rrl9-3001.inc1.devtunnels.ms",
        "https://ethglobal-backend-ekaxauyxxq-vp.a.run.app",
      ],
    },
  },

  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
