
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // The explicit 'env' block for NEXT_PUBLIC_ variables has been removed.
  // Next.js automatically exposes variables prefixed with NEXT_PUBLIC_ to the browser.
  // Non-NEXT_PUBLIC_ variables like GOOGLE_API_KEY (if needed by server-side code in next.config.ts or API routes)
  // are directly available via process.env on the server.
  // If GOOGLE_API_KEY was intended for client-side, it should be prefixed with NEXT_PUBLIC_.
  // For this specific issue, we are focusing on NEXT_PUBLIC_FIREBASE_DATABASE_URL.
};

export default nextConfig;
