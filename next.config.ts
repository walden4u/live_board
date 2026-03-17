import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // 서버 사이드: 내부 URL 사용
    // 클라이언트 사이드: /pb 프록시 사용
    const pbUrl = process.env.POCKETBASE_INTERNAL_URL || 'http://mini3-pocketbase-2ede60-194-233-73-98.traefik.me';

    return [
      {
        source: '/pb/:path*',
        destination: `${pbUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
