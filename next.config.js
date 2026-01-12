/** @type {import('next').NextConfig} */
const nextConfig = {
  // ??? SOVEREIGN BUILD SHIELD
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["ssh2", "node-ssh"],
};

module.exports = nextConfig;
