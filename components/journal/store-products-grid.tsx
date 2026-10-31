import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EditorialCard from '@/components/shared/editorial-card'
import type { ProductType, StoreProduct } from '@/types/database'

async function getProducts(productType: ProductType): Promise<StoreProduct[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('store_products')
      .select('*')
      .eq('status', 'published')
      .eq('product_type', productType)
      .order('sort_order', { ascending: true })
    return data ?? []
  } catch {
    return []
  }
}

export default async function StoreProductsGrid({
  productType,
  basePath,
  sectionColor,
}: {
  productType: ProductType
  basePath: string
  sectionColor: string
}) {
  const products = await getProducts(productType)
  const isEbook = productType === 'ebook'

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-5">{isEbook ? '📚' : '🛍️'}</p>
        <h2 className="font-display text-2xl font-semibold mb-3">{isEbook ? 'Publications coming soon' : 'Merchandise coming soon'}</h2>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {isEbook ? 'Our ebook catalog is coming together.' : 'Our merchandise store is coming together.'} Check back shortly.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs font-mono text-muted-foreground">
          {products.length} item{products.length !== 1 ? 's' : ''} available
        </p>
        <Link href="/cart" className="text-xs font-mono font-semibold hover:underline" style={{ color: sectionColor }}>
          View Cart →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((product) => {
          const imageUrl = product.image_path
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/store-media/${product.image_path}`
            : null
          return (
            <EditorialCard
              key={product.id}
              href={`${basePath}/${product.slug}`}
              imageUrl={imageUrl}
              imageAlt={product.name}
              fallbackEmoji={isEbook ? '📖' : '🛍️'}
              imageHeight="h-40"
              badge={product.coming_soon ? 'Coming Soon' : null}
              title={product.name}
              description={product.description}
              meta={product.coming_soon ? 'Not yet available' : `${product.currency} ${Number(product.price).toLocaleString()}`}
              metaColor={sectionColor}
              metaMuted={product.coming_soon}
            />
          )
        })}
      </div>
    </>
  )
}
