import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StoreProductDetail from '@/components/journal/store-product-detail'
import type { StoreProduct } from '@/types/database'

const SHOP_COLOR = '#1B6B3A'

interface Props {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string): Promise<StoreProduct | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('store_products')
    .select('*')
    .eq('slug', slug)
    .eq('product_type', 'merchandise')
    .eq('status', 'published')
    .single()
  return data
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Not Found' }
  return {
    title: `${product.name} — Shop`,
    description: product.description ?? undefined,
    alternates: { canonical: `https://kiamburoad.com/shop/${slug}` },
  }
}

export default async function ShopItemPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="py-8" style={{ backgroundColor: SHOP_COLOR + '15' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-foreground">Shop</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreProductDetail product={product} sectionColor={SHOP_COLOR} />
      </div>
    </div>
  )
}
