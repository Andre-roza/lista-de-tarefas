import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    appIsrStatus: false,
  },
  allowedDevOrigins: ['10.104.207.7', 'localhost', '127.0.0.1'],
};

export default nextConfig;
