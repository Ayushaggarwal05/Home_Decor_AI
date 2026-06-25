import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
        pathname: "/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        // Proxy all /api/* calls to FastAPI — avoids browser CORS entirely
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/dashboard",
        destination: "/studio",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
