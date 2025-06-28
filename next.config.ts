// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      // Add other domains if you use images from them
    ],
    // DANGER: Only enable if you fully trust all SVG sources.
    // SVGs can contain executable code.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment", // Recommended with dangerouslyAllowSVG
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Recommended with dangerouslyAllowSVG
  },
};

module.exports = nextConfig;
