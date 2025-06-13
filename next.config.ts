import type { NextConfig } from "next";

const nextConfig: NextConfig = {
 images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ]
  },
};

export default nextConfig;
