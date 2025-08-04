/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["via.placeholder.com", "128.140.78.75"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "128.140.78.75",
      },
      {
        protocol: "https", 
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
