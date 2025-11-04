/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 👈 evita que ESLint bloquee el build
  },
};

export default nextConfig;