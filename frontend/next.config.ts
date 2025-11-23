import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export", // Enable static export
  images: {
    unoptimized: true, // Required for static export
  },
  turbopack: {
    root: path.resolve(__dirname), // Explicitly set the workspace root to silence the warning
  },
};

export default nextConfig;
