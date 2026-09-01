import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "msw",
    "@mswjs/interceptors",
    "@open-draft/deferred-promise",
    "rettime",
    "until-async",
  ],
  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
