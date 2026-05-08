/** @type {import('next').NextConfig} */
import "./scripts/guard.cjs";

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['localhost', '127.0.0.1', 'hacker.rk'],
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? true : false,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
