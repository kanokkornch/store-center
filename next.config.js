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
  }
}
