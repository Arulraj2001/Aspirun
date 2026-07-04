import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Image optimization for better Core Web Vitals
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google profile photos
    ],
  },

  // Compress responses
  compress: true,

  // Security & SEO headers
  async headers() {
    return [
      // Private pages — tell Google not to index
      {
        source: "/student/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ]
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ]
      },
      // Public content pages — CDN cache for fast serving
      {
        source: "/:path(materials|mock-tests|current-affairs|guidance|study-planner|daily-quiz|community)/:subpath*",
        headers: [
          { key: "Cache-Control", value: "public, s-maxage=60, stale-while-revalidate=300" },
        ]
      },
      // Security headers on all pages
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ]
      }
    ];
  },

  // Redirect old paths if needed
  async redirects() {
    return [
      // If someone visits /today (old route), redirect to dashboard
      {
        source: '/today',
        destination: '/student/dashboard',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
