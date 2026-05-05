import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.touchlinefc.co.uk",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
