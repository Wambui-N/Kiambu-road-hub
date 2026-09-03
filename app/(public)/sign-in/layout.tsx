import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — Kiambu Road Explorer',
  robots: { index: false, follow: true },
}

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
