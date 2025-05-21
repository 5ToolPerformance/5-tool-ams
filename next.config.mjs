import createJiti from "jiti";
const jiti = createJiti(import.meta.url);
 
// Import env here to validate during build. Using jiti@^1 we can import .ts files :)
const mod = await jiti.import("./src/env/server.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        typedRoutes: true,
    }
};

export default nextConfig;