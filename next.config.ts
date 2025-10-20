import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/blog',
  assetPrefix: '/blog',
  trailingSlash: true,
  output: 'export',

  // パフォーマンス最適化
  compress: true,
  poweredByHeader: false,

  // 画像最適化
  images: {
    unoptimized: true, // Static exportのため
  },

  // webpack最適化
  webpack: (config, { dev, isServer }) => {
    // 本番環境でのバンドル最適化
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

  // 高速リフレッシュの改善
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
