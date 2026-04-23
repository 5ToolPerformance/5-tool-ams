import createJiti from "jiti";

const jiti = createJiti(import.meta.url);

await jiti.import("./src/env/server.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
};

export default nextConfig;
