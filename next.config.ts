import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // basePath と assetPrefix をコメントアウト
  // basePath: '/blog',
  // assetPrefix: '/blog',
  
  trailingSlash: true,
  output: 'export',
  
  compress: true,
  poweredByHeader: false,
  
  images: {
    unoptimized: true,
  },
  
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            commons: {
              name: 'commons',
              chunks: 'all',
              minChunks: 2,
            },
          },
        },
      }
    }
    return config
  },
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
