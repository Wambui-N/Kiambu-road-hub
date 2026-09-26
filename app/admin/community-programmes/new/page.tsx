import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import CommunityProgrammeForm from '@/components/admin/community-programme-form'

export default function NewCommunityProgrammePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/community-programmes" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Project</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new community project</p>
        </div>
      </div>
      <CommunityProgrammeForm />
    </div>
  )
}
