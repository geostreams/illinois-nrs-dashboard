/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost' },
            { protocol: 'https', hostname: 'strapi.illinois-nlrs.ncsa.illinois.edu' },
            { protocol: 'https', hostname: 'strapi.ilnlrs-dev.ncsa.illinois.edu' },
        ],
        // CMS_URL points at the local Strapi container (localhost) in dev; the
        // production remotePatterns above only ever resolve to public hosts.
        dangerouslyAllowLocalIP: true,
    },
    env: {
        CMS_URL: process.env.CMS_URL,
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
            '*.png': {
                type: 'asset',
            },
        },
    },
};

module.exports = nextConfig;
