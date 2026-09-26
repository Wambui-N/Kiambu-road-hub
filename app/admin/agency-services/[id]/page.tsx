import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import AgencyServiceForm from '@/components/admin/agency-service-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAgencyServicePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('agency_services').select('*').eq('id', id).single()

  if (!item) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/agency-services" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Service</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">{item.slug}</p>
        </div>
      </div>
      <AgencyServiceForm initialData={item as Record<string, unknown>} />
    </div>
  )
}
