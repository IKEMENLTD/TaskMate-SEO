import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/blog',
  assetPrefix: '/blog',
  trailingSlash: true,
  output: 'export',
}

export default nextConfig
