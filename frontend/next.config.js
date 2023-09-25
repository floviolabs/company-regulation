/** @type {import('next').NextConfig} */
const nextConfig = {
    // basePath: '/dev',
    reactStrictMode: true,
    swcMinify: true,
    compiler: {
      removeConsole: process.env.NODE_ENV !== "development",
    },
  };
  
  const withPWA = require("next-pwa")({
    dest: "public",
    disableDevLogs: true,
    register: true,
  });
  
  module.exports = withPWA(nextConfig);
  
  