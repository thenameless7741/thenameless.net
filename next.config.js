/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'export',
  poweredByHeader: false,
  reactStrictMode: true,
};
module.exports = nextConfig;
