import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  outputFileTracingRoot: import.meta.dirname,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
