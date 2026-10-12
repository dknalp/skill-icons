import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // SVGs are served from our own /icons route, no external image hosts needed.
  // If you add an <Image src="..."> pointing at an external host, add it here.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;