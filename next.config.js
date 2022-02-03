/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error('Required GitHub provider credentials not set');
}

module.exports = nextConfig
