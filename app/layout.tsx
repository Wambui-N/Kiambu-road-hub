import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kiamburoad-hub.com'),
  title: {
    default: 'Kiambu Road Explorer — Business Directory & Lifestyle Journal',
    template: '%s | Kiambu Road Explorer',
  },
  description:
    'Your complete online business directory and lifestyle journal for Kiambu Road, Nairobi. Discover restaurants, hotels, hospitals, schools, and more.',
  keywords: ['Kiambu Road', 'Nairobi', 'business directory', 'Kenya', 'Ridgeways', 'Thindigua', 'Runda'],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: 'https://kiamburoad-hub.com',
    siteName: 'Kiambu Road Explorer',
    title: 'Kiambu Road Explorer — Business Directory & Lifestyle Journal',
    description: 'Discover local businesses, services and lifestyle content along Kiambu Road.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kiambu Road Explorer',
    description: 'Your complete business directory for Kiambu Road, Nairobi.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
