import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // PocketBase API를 /pb 경로로 프록시
    const pbUrl = process.env.POCKETBASE_INTERNAL_URL || 'http://pocketbase:8090';

    return [
      {
        source: '/pb/:path*',
        destination: `${pbUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
