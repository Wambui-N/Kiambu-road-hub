import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import EventForm from '@/components/admin/event-form'

export default function NewEventPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/events" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold">Add Event</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Create a new event or expo</p>
        </div>
      </div>
      <EventForm />
    </div>
  )
}
