/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Arena assigns a fresh preview subdomain; allow its live preview origin in dev.
  allowedDevOrigins: ['*.e2b.app']
};

export default nextConfig;
