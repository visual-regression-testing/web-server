/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,

    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USERNAME: process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    PORT: 3306
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    return config
  },
  webpack5: false,
}

// proceed to transpile typescript dependencies
// https://github.com/martpie/next-transpile-modules#withtmtranspilemodules--options
const withTM = require('next-transpile-modules')(['visual-regression-shared']); // pass the modules you would like to see transpiled

module.exports = withTM(nextConfig);
