import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import PeopleProfileForm from '@/components/admin/people-profile-form'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPeopleProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: item } = await supabase.from('people_profiles').select('*').eq('id', id).single()

  if (!item) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/people-profiles" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-mono">{item.slug}</p>
        </div>
      </div>
      <PeopleProfileForm initialData={item as Record<string, unknown>} />
    </div>
  )
}
