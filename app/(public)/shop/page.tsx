import { Metadata } from 'next'
import StoreProductsGrid from '@/components/journal/store-products-grid'

const SHOP_COLOR = '#1B6B3A'

export const metadata: Metadata = {
  title: 'Shop — Kiambu Road Explorer',
  description: 'Explorer Merchandise — official Kiambu Road Explorer gear, delivered locally.',
  alternates: { canonical: 'https://kiamburoad.com/shop' },
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent font-mono text-xs uppercase tracking-widest mb-2">Explorer Merchandise</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">Shop</h1>
          <p className="text-white/80 text-base max-w-xl">
            Official Kiambu Road Explorer gear and merchandise — wear the community, carry the story.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreProductsGrid productType="merchandise" basePath="/shop" sectionColor={SHOP_COLOR} />
      </div>
    </div>
  )
}
