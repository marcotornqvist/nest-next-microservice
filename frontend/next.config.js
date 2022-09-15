/** @type {import('next').NextConfig} */
const path = require('path');
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const nextConfig = (phase) => {
  // Checks if environment is in development or something else (E.g. production)
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const TODO_URL = isDev
    ? 'http://localhost:4000/todos'
    : process.env.NEXT_PUBLIC_TODO_URL;

  const AUTH_URL = isDev
    ? 'http://localhost:4001/auth'
    : process.env.NEXT_PUBLIC_AUTH_URL;

  return {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    env: {
      TODO_URL,
      AUTH_URL,
    },
  };
};

module.exports = nextConfig;
