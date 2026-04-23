import createJiti from "jiti";

const jiti = createJiti(import.meta.url);

// Workspace-level compatibility shim.
await jiti.import("./apps/legacy/src/env/server.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

export default nextConfig;
