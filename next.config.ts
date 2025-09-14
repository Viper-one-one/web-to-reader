import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  async rewrites() {
    return [
      {
        source: '/process',
        destination: 'http://localhost:5000/process' // Proxy to Backend
      }
    ]
  }
}

export default nextConfig;
