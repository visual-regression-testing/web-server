/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
  },
  reactStrictMode: true,
}

module.exports = nextConfig

const transpileModulesOptions = process.env.NODE_ENV === 'local' ? {
  resolveSymlinks: false // this is for linking packages with `npm link` -> https://github.com/martpie/next-transpile-modules#note-on-resolvesymlinks
} : {};

// proceed to transpile typescript dependencies
// https://github.com/martpie/next-transpile-modules#withtmtranspilemodules--options
const withTM = require('next-transpile-modules')(['visual-regression-shared'], transpileModulesOptions); // pass the modules you would like to see transpiled

module.exports = withTM({});
