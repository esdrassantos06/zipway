import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' https://pagead2.googlesyndication.com 'unsafe-inline';
  style-src 'self' 'unsafe-inline' 'unsafe-eval';
  img-src 'self' data: https://lh3.googleusercontent.com https://*.googlesyndication.com https://avatars.githubusercontent.com https://github.com;
  font-src 'self';
  connect-src 'self' https://api.iconify.design https://api.github.com;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s+/g, " ").trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicyHeaderValue,
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@node-rs/argon2"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
