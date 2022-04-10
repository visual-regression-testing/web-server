/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  console.log('GitHub provider credentials set');
}

module.exports = nextConfig

// proceed to transpile typescript dependencies
// https://github.com/martpie/next-transpile-modules#withtmtranspilemodules--options
const withTM = require('next-transpile-modules')(['visual-regression-shared']); // pass the modules you would like to see transpiled

module.exports = withTM({});
