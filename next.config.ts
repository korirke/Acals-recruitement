import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    unoptimized: true,
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