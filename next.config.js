module.exports = {
  reactStrictMode: true,
  distDir: 'build',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['localhost'],
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
