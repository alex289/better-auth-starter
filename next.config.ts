import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
