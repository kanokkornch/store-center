module.exports = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/dashbord',
        permanent: true,
      }
    ]
  }
}
