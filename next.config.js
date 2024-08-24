/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure body parser settings for API routes
  api: {
    bodyParser: false,
  },
};

module.exports = nextConfig;
