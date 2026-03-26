/**
 * Validates that all required environment variables are set.
 * Import this at the top of server-side entry points or call it in
 * the root layout server component to surface misconfiguration early.
 */

const REQUIRED_SERVER_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

const REQUIRED_PUBLIC_VARS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const

const OPTIONAL_VARS = [
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'RESEND_API_KEY',
  'NEXT_PUBLIC_SITE_URL',
  'ADMIN_EMAIL',
] as const

type ServerVar = (typeof REQUIRED_SERVER_VARS)[number]
type PublicVar = (typeof REQUIRED_PUBLIC_VARS)[number]

export function validateServerEnv(): void {
  const missing = REQUIRED_SERVER_VARS.filter((key) => !process.env[key])
  if (missing.length > 0) {
    throw new Error(
      `[Kiambu Road Explorer] Missing required environment variables:\n  ${missing.join('\n  ')}\n\nCopy .env.local.example to .env.local and fill in the values.`
    )
  }
}

export function getEnv<K extends ServerVar>(key: K): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`[Kiambu Road Explorer] Environment variable "${key}" is not set.`)
  }
  return value
}

export function getPublicEnv<K extends PublicVar>(key: K): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`[Kiambu Road Explorer] Public environment variable "${key}" is not set.`)
  }
  return value
}

export function getOptionalEnv(key: (typeof OPTIONAL_VARS)[number]): string | undefined {
  return process.env[key]
}

/** Safe env summary for debugging (masks sensitive keys). */
export function getEnvSummary(): Record<string, string> {
  const mask = (val: string | undefined) =>
    val ? (val.length > 8 ? `${val.slice(0, 4)}...${val.slice(-4)}` : '***') : '(not set)'

  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '(not set)',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    RESEND_API_KEY: mask(process.env.RESEND_API_KEY),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: mask(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '(not set)',
  }
}
