/** @type {import('next').NextConfig} */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function supabaseImagePattern() {
  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
}

const storageHost = supabaseImagePattern();
const remotePatterns = [
  ...(storageHost ? [{ protocol: "https", hostname: storageHost, pathname: "/storage/v1/object/public/**" }] : []),
  ...(storageHost ? [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }] : []),
];

const nextConfig = {
  images: {
    remotePatterns,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
