import { createClient } from '@/lib/supabase/server'
import DonationStatusSelect from '@/components/admin/donation-status-select'
import type { DonationPledge } from '@/types/database'

async function getDonations(): Promise<DonationPledge[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('donation_pledges').select('*').order('created_at', { ascending: false })
    return data ?? []
  } catch { return [] }
}

const STATUS_COLOR: Record<string, string> = {
  pending_payment: 'bg-amber-100 text-amber-700',
  received: 'bg-green-100 text-green-700',
  cancelled: 'bg-muted text-muted-foreground',
}

export default async function DonationsPage() {
  const donations = await getDonations()
  const pendingCount = donations.filter((d) => d.status === 'pending_payment').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Donation Pledges</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{donations.length} total · {pendingCount} awaiting payment</p>
        <p className="text-xs text-muted-foreground mt-1">
          No online payment is collected yet — contact each donor to arrange payment, then update status here.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {donations.length === 0 ? (
          <div className="text-center py-16"><p className="text-4xl mb-4">💝</p><p className="text-sm text-muted-foreground">No pledges yet.</p></div>
        ) : (
          <div className="divide-y divide-border">
            {donations.map((d) => (
              <div key={d.id} className="p-4 hover:bg-muted/20">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm">{d.donor_name}</p>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[d.status] ?? ''}`}>{d.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {d.phone && <><a href={`tel:${d.phone}`} className="hover:text-primary">{d.phone}</a> · </>}
                      <a href={`mailto:${d.email}`} className="hover:text-primary">{d.email}</a>
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {d.currency} {Number(d.amount).toLocaleString()} · <span className="font-normal text-muted-foreground capitalize">{d.frequency.replace('_', ' ')}</span>
                    </p>
                    {d.project && <p className="text-xs text-muted-foreground mt-0.5">For: {d.project}</p>}
                    {d.additional_instructions && <p className="text-sm mt-1 text-muted-foreground line-clamp-2">{d.additional_instructions}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-[10px] font-mono text-muted-foreground">{new Date(d.created_at).toLocaleDateString()}</p>
                    <DonationStatusSelect id={d.id} status={d.status} />
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
