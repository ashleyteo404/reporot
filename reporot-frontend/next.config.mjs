/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/generate/:path*',
        destination: 'http://localhost:8000/generate/:path*',
      },
    ];
  },
};

export default nextConfig;
