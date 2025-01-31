import "./src/env.js";

/** @type {import('next').NextConfig} */
export const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
