import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 persists Turbopack's development cache to disk by default.  This
  // project accumulates a large cache, which causes sustained SSD activity.
  // Keep dev artifacts in memory instead; restarting dev will take longer.
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  // Keep Next's resolver and file tracer inside this application when a
  // parent folder happens to contain another lockfile.
  turbopack: {
    root: process.cwd(),
  },
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
