/** @type {import('next').NextConfig} */
import "./scripts/guard.cjs";

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['localhost', '127.0.0.1','hacker.rk'],
};

export default nextConfig;
