/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@napi-rs/canvas': 'commonjs @napi-rs/canvas'
      });
    }
    // Ignore native modules in client-side bundle
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      '@napi-rs/canvas': false
    };
    return config;
  }
}

module.exports = nextConfig

