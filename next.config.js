const { withContentlayer } = require("next-contentlayer2");
import("./env.mjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions:['mdx','ts','tsx'],
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/*/**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental:{
    mdxRs:true,
  }
};

module.exports = withContentlayer(nextConfig);
