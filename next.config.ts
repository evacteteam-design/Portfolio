import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  // Disabled because the SLDS demo's third-party DataTable uses a legacy
  // UNSAFE_componentWillUpdate lifecycle that Strict Mode's dev-only double-render
  // check flags as a console error. Strict Mode has no effect in production builds.
  reactStrictMode: false,
};

export default nextConfig;
