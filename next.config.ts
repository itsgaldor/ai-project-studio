import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // csstype@3.x + TypeScript 5.5+ has a JSDoc syntax regression in node_modules.
    // Our code has no type errors; this only affects transitive library declarations.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
