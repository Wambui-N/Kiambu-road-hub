import crypto from 'crypto'

/** SHA-256 + fixed salt, truncated — used to de-duplicate anonymous actions (outbound clicks, review votes) without storing raw IPs. */
export function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + 'kra-click').digest('hex').slice(0, 12)
}
