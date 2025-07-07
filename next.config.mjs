// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/ar',
        destination: '/ar',
      },
    ];
  },
};

export default nextConfig;

