/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: [
            'localhost',
            'strapi',
            'strapi.illinois-nrs.ncsa.illinois.edu',
        ], // Replace 'strapi' with your production Strapi domain
    },
    env: {
        CMS_API_URL: process.env.CMS_API_URL,
        CMS_DATA_URL: process.env.CMS_DATA_URL,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

module.exports = nextConfig;
