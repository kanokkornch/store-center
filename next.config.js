module.exports = {
  reactStrictMode: true,
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
