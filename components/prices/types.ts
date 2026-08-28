export interface PriceRow {
  id: string
  itemId: string
  itemName: string
  itemSlug: string
  category: string | null
  unit: string | null
  amount: number
  currency: string
  observedAt: string
  storeName: string
  businessId: string | null
  businessSlug: string | null
  areaName: string | null
  lat: number | null
  lng: number | null
  googleMapsUrl: string | null
  whatsapp: string | null
  phone: string | null
}
