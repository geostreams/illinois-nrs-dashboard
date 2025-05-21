/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'strapi.illinois-nrs.ncsa.illinois.edu'],
    },
    env: {
        CMS_API_URL: process.env.CMS_API_URL,
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });

        // PNG file handling
        config.module.rules.push({
            test: /\.png$/,
            type: 'asset/resource',
        });

        return config;
    },
};

module.exports = nextConfig;
