import { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

module.exports = {
  allowedDevOrigins: ['192.168.1.112'],
  env: {
    APP_VERSION: version,
  },
};

