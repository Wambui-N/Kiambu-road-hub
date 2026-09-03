'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import type { DoctorServiceType } from '@/types/database'

interface DoctorRequestFormProps {
  serviceType: DoctorServiceType
  salutation: string
  submitLabel: string
  bodyPlaceholder: string
}

export default function DoctorRequestForm({ serviceType, salutation, submitLabel, bodyPlaceholder }: DoctorRequestFormProps) {
  const isConsultation = serviceType === 'consultation'

  const [age, setAge] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [county, setCounty] = useState('')
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | ''>('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!age.trim() || !gender) {
      toast.error('Please fill in your age and select a gender.')
      return
    }
    if (isConsultation && !county.trim()) {
      toast.error('Please enter your county of residence.')
      return
    }
    if (!isConsultation && !maritalStatus) {
      toast.error('Please select your marital status.')
      return
    }
    if (!message.trim() || message.trim().length < 10) {
      toast.error('Please share a bit more detail.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/dear-doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          age,
          gender,
          county: isConsultation ? county : undefined,
          marital_status: !isConsultation ? maritalStatus : undefined,
          message,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Could not submit')
      }
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not submit. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="font-display text-lg font-bold text-foreground mb-2">Request sent</h3>
        <p className="text-sm text-muted-foreground">
          {isConsultation
            ? 'Our doctor will respond within 12 hours.'
            : 'Our counsellor will be in touch soon.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6 sm:p-8 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor={`${serviceType}-age`}>My age</Label>
          <Input
            id={`${serviceType}-age`}
            type="number"
            min={1}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>I am</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-colors ${
                gender === 'male' ? 'bg-primary text-white border-primary' : 'border-input text-muted-foreground hover:border-primary'
              }`}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-colors ${
                gender === 'female' ? 'bg-primary text-white border-primary' : 'border-input text-muted-foreground hover:border-primary'
              }`}
            >
              Female
            </button>
          </div>
        </div>
      </div>

      {isConsultation ? (
        <div className="space-y-1.5">
          <Label htmlFor="county">My place/county of residence</Label>
          <Input
            id="county"
            value={county}
            onChange={(e) => setCounty(e.target.value)}
            placeholder="e.g. Kiambu"
            required
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          <Label>Marital status</Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMaritalStatus('single')}
              className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-colors ${
                maritalStatus === 'single' ? 'bg-primary text-white border-primary' : 'border-input text-muted-foreground hover:border-primary'
              }`}
            >
              Single
            </button>
            <button
              type="button"
              onClick={() => setMaritalStatus('married')}
              className={`flex-1 h-9 rounded-lg border text-sm font-medium transition-colors ${
                maritalStatus === 'married' ? 'bg-primary text-white border-primary' : 'border-input text-muted-foreground hover:border-primary'
              }`}
            >
              Married
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor={`${serviceType}-message`}>{salutation}:</Label>
        <Textarea
          id={`${serviceType}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={bodyPlaceholder}
          rows={6}
          required
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Using this service assumes acceptance of the{' '}
        <a href="/dear-doctor/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          terms of service
        </a>
        .
      </p>

      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 h-12">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        {loading ? 'Sending...' : submitLabel}
      </Button>
    </form>
  )
}
