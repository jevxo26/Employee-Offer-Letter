import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next's resolver and file tracer inside this application when a
  // parent folder happens to contain another lockfile.
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
