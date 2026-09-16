import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/Santhiram-college' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? '/Santhiram-college' : '',
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
