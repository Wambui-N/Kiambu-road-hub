'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ProductType } from '@/types/database'

const STORAGE_KEY = 'kre_cart_v1'

export interface CartItem {
  product_id: string
  name: string
  price: number
  currency: string
  product_type: ProductType
  image_path: string | null
  quantity: number
}

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event('kre-cart-updated'))
  } catch {
    // localStorage unavailable — cart just won't persist
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    setItems(readCart())
    const onUpdate = () => setItems(readCart())
    window.addEventListener('kre-cart-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('kre-cart-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const current = readCart()
    const existing = current.find((i) => i.product_id === item.product_id)
    const next = existing
      ? current.map((i) => (i.product_id === item.product_id ? { ...i, quantity: i.quantity + quantity } : i))
      : [...current, { ...item, quantity }]
    writeCart(next)
    setItems(next)
  }, [])

  const updateQuantity = useCallback((product_id: string, quantity: number) => {
    const current = readCart()
    const next = quantity <= 0
      ? current.filter((i) => i.product_id !== product_id)
      : current.map((i) => (i.product_id === product_id ? { ...i, quantity } : i))
    writeCart(next)
    setItems(next)
  }, [])

  const removeItem = useCallback((product_id: string) => {
    const current = readCart().filter((i) => i.product_id !== product_id)
    writeCart(current)
    setItems(current)
  }, [])

  const clearCart = useCallback(() => {
    writeCart([])
    setItems([])
  }, [])

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const hasMerchandise = items.some((i) => i.product_type === 'merchandise')

  return { items, addItem, updateQuantity, removeItem, clearCart, subtotal, count, hasMerchandise }
}
