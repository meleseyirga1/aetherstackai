/** @type {import('next').NextConfig} */
const nextConfig = {
  // Absolute requirement for AetherStack SSH Bridge
  serverExternalPackages: ["ssh2", "node-ssh"],
  
  // Disable Turbopack for security stability
  experimental: {
    turbo: {
      rules: {
        // Prevent turbo from trying to bundle binary files
        "*.node": ["raw"],
      },
    },
  },
};

module.exports = nextConfig;
