/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["ssh2", "node-ssh"],
  eslint: {
    // 🛡️ SHIELD: Ignore linting errors during build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🛡️ SHIELD: Ignore typescript errors during build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;