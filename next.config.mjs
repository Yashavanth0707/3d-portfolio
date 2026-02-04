/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber', 'three', 'framer-motion'],
  },

  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Webpack configuration for Three.js optimization
  webpack: (config, { isServer }) => {
    // Handle canvas for SSR
    if (isServer) {
      config.externals.push({
        canvas: 'commonjs canvas',
      });
    }

    // GLSL shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
