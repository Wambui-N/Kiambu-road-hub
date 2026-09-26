import { createClient } from '@/lib/supabase/server'
import StoreOrderActions from '@/components/admin/store-order-actions'
import type { StoreOrder } from '@/types/database'

async function getOrders(): Promise<StoreOrder[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('store_orders').select('*').order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const STATUS_COLOR: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  paid: 'bg-blue-100 text-blue-700',
  fulfilled: 'bg-green-100 text-green-700',
  cancelled: 'bg-muted text-muted-foreground',
}

export default async function StoreOrdersPage() {
  const orders = await getOrders()
  const pendingCount = orders.filter((o) => o.status === 'pending_payment').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Store Orders</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{orders.length} total · {pendingCount} awaiting payment</p>
        <p className="text-xs text-muted-foreground mt-1">
          No online payment is collected yet — contact each customer to arrange payment, then update status here.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">🛒</p><p className="text-sm text-muted-foreground">No orders yet.</p></div>
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-muted/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{order.customer_name}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? ''}`}>{order.status}</span>
                      <span className="text-[10px] font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <a href={`tel:${order.phone}`} className="hover:text-primary">{order.phone}</a> · <a href={`mailto:${order.email}`} className="hover:text-primary">{order.email}</a>
                    </p>
                    {order.delivery_address && <p className="text-xs text-muted-foreground mt-0.5">Deliver to: {order.delivery_address}</p>}
                    <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                      {order.items.map((item) => (
                        <li key={item.product_id}>{item.name} × {item.quantity} — {order.currency} {(item.price * item.quantity).toLocaleString()}</li>
                      ))}
                    </ul>
                    <p className="text-sm font-semibold mt-2">Total: {order.currency} {Number(order.total_amount).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-[10px] font-mono text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                    <StoreOrderActions order={order} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
