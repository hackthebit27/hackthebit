import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The console HTML is read from disk at request time, so make sure it ships
  // with the serverless function that serves it.
  outputFileTracingIncludes: {
    "/sql-console/app": ["./content/sql-console/**/*"],
  },
};

export default nextConfig;
