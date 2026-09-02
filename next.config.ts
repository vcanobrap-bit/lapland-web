import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Los errores de tipos rompen el build a propósito: `npm run typecheck` en CI.
    ignoreBuildErrors: false,
  },
}

export default nextConfig
