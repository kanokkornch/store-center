module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost', 'e7.pngegg.com'],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      }
    ]
  },
  env: {
    SELLER_API: process.env.SELLER_API
  }
}
