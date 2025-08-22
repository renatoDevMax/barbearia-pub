import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['mongoose'],
  experimental: {
    esmExternals: "loose",
  },
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true
    };
    return config;
  },
};

export default nextConfig;
