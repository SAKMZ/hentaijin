/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.hentaijin.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
