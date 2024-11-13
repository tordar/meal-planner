/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        optimizeCss: true,
    },
    // Add this to potentially help with the 404 and 500 page issues
    output: 'standalone',
}

export default nextConfig;