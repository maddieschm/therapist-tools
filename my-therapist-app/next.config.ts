import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  async redirects() {
    return [
      {
        source: '/notegenerator',
        destination: '/notegenerator/index.html',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;