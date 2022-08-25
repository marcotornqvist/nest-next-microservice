/** @type {import('next').NextConfig} */
const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = (phase) => {
  // Checks if environment is in development or something else (E.g. production)
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const BASE_URL = isDev
    ? 'http://localhost:4000'
    : process.env.NEXT_PUBLIC_BASE_URL;

  return {
    reactStrictMode: true,
    swcMinify: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    env: {
      BASE_URL,
    },
  };
};

module.exports = nextConfig;
