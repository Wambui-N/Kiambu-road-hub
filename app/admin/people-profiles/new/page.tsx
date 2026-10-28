import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import PeopleProfileForm from '@/components/admin/people-profile-form'

export default function NewPeopleProfilePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/people-profiles" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Profile</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Add a new People of Kiambu Road profile</p>
        </div>
      </div>
      <PeopleProfileForm />
    </div>
  )
}
