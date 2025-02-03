/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'strapi', 'strapi.illinois-nrs.ncsa.illinois.edu'], // Replace 'strapi' with your production Strapi domain
    },
    env: {
        NEXT_PUBLIC_CMS_API_URL: process.env.NEXT_PUBLIC_CMS_API_URL,
    },
};

module.exports = nextConfig;
