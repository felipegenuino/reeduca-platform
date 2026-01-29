/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@reeduca/ui', '@reeduca/database', '@reeduca/auth', '@reeduca/pagamentos'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

export default nextConfig;
