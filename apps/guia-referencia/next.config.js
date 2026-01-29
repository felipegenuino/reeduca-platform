/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@reeduca/ui'],
  output: 'export', // Para funcionar offline (PWA)
};

export default nextConfig;
