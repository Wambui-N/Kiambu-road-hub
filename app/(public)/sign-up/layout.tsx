import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up — Kiambu Road Explorer',
  robots: { index: false, follow: true },
}

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return children
}
