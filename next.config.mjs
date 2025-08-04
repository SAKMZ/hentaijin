/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "128.140.78.75",
        port: "3000",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
