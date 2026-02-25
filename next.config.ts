import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "fortunekenya.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "fortunekenya.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;