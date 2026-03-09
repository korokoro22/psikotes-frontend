import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'ozklhkritpbdehhmoawz.supabase.co',
    ],
    
  },
  eslint: {
    ignoreDuringBuilds: true,
  }, 
}satisfies NextConfig;

export default nextConfig;
