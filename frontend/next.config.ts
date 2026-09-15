import type { NextConfig } from 'next';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';

const parseOrigin = (value?: string): string | null => {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const apiOrigin = parseOrigin(process.env.NEXT_PUBLIC_API_BASE);

const buildCspValue = (): string => {
  const connectSources = new Set<string>(["'self'"]);
  const scriptSources = ["'self'", "'unsafe-inline'"];

  if (apiOrigin) {
    connectSources.add(apiOrigin);
  }

  if (isProduction) {
    connectSources.add('https:');
  } else {
    scriptSources.push("'unsafe-eval'");
    connectSources.add('http:');
    connectSources.add('https:');
    connectSources.add('ws:');
    connectSources.add('wss:');
  }

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "frame-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "img-src 'self' data: blob: https:",
    "style-src 'self' 'unsafe-inline'",
    `script-src ${scriptSources.join(' ')}`,
    "font-src 'self' data:",
    `connect-src ${Array.from(connectSources).join(' ')}`
  ].join('; ');
};

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'off'
  },
  {
    key: 'Content-Security-Policy',
    value: buildCspValue()
  }
];

if (isProduction) {
  securityHeaders.push({
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload'
  });
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  turbopack: {
    root: projectRoot
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      { source: '/resource-center', destination: '/resources', permanent: true },
      { source: '/events', destination: '/professional-development/events', permanent: true }
    ];
  }
};

export default nextConfig;
