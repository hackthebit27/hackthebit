import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The console HTML files are read from disk at request time, so make sure they ship
  // with the serverless functions that serve them.
  outputFileTracingIncludes: {
    "/sql-console/app": ["./content/sql-console/**/*"],
    "/cpp-console/app": ["./content/cpp-console/**/*"],
  },
};

export default nextConfig;
