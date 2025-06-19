import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/notegenerator', // This path will be redirected
        destination: '/notegenerator/index.html', // This is where it will be sent
        permanent: true, // Use `true` for a permanent 301 redirect, `false` for a temporary 302 redirect
      },
    ];
  },
};

export default nextConfig;