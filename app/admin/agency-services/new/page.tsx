import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import AgencyServiceForm from '@/components/admin/agency-service-form'

export default function NewAgencyServicePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/agency-services" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Service</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new agency service listing</p>
        </div>
      </div>
      <AgencyServiceForm />
    </div>
  )
}
