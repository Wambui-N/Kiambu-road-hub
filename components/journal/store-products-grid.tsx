import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
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
  sectionSlug,
  sectionColor,
}: {
  productType: ProductType
  sectionSlug: string
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
            <Link
              key={product.id}
              href={`/journal/${sectionSlug}/${product.slug}`}
              className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative h-40 overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                {imageUrl ? (
                  <Image src={imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                ) : (
                  <span className="text-4xl">{isEbook ? '📖' : '🛍️'}</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-3">{product.description}</p>
                )}
                <p className="font-mono font-bold mt-auto pt-2 text-sm" style={{ color: sectionColor }}>
                  {product.currency} {Number(product.price).toLocaleString()}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
