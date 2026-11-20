/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    // old multi-page URLs → sections of the new single-page dev profile
    return [
      { source: '/about-us', destination: '/#work', permanent: true },
      { source: '/projects', destination: '/#projects', permanent: true },
      { source: '/contact-us', destination: '/#contact', permanent: true },
    ]
  },
}
