'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react'
import { CATEGORIES } from '@/data/seed/categories'

const TOTAL_STEPS = 8

type FormData = {
  category_name: string
  subcategory_name: string
  business_name: string
  road_street: string
  building_name: string
  door_number: string
  contact_name: string
  phone: string
  whatsapp: string
  website: string
  email: string
  short_description: string
}

const EMPTY: FormData = {
  category_name: '',
  subcategory_name: '',
  business_name: '',
  road_street: '',
  building_name: '',
  door_number: '',
  contact_name: '',
  phone: '',
  whatsapp: '',
  website: '',
  email: '',
  short_description: '',
}

const STEP_TITLES = [
  'Choose Category',
  'Choose Subcategory',
  'Business Name',
  'Location Details',
  'Contact Person',
  'Phone & WhatsApp',
  'Online Presence',
  'Review & Submit',
]

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono text-muted-foreground">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-mono font-semibold text-primary">
          {STEP_TITLES[step - 1]}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={false}
          animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

export default function ListYourBusinessPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (key: keyof FormData, value: string) =>
    setForm((p) => ({ ...p, [key]: value }))

  const selectedCategory = CATEGORIES.find((c) => c.name === form.category_name)

  const validateStep = (): string => {
    switch (step) {
      case 1: return form.category_name ? '' : 'Please select a category'
      case 3: return form.business_name.trim() ? '' : 'Business name is required'
      case 4: return form.road_street.trim() ? '' : 'Road / street is required'
      case 5: return form.contact_name.trim() ? '' : 'Contact name is required'
      case 6:
        if (!form.phone.trim()) return 'Phone number is required'
        return ''
      case 7:
        if (!form.email.trim()) return 'Email address is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Please enter a valid email'
        if (!form.short_description.trim()) return 'Short description is required'
        if (form.short_description.trim().split(/\s+/).filter(Boolean).length > 25)
          return 'Short description must be 25 words or fewer'
        return ''
      default: return ''
    }
  }

  const next = () => {
    const err = validateStep()
    if (err) { setError(err); return }
    setError('')
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }

  const back = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submit-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: form.business_name,
          category_name: form.category_name,
          subcategory_name: form.subcategory_name,
          location_text: [form.road_street, form.building_name, form.door_number].filter(Boolean).join(', '),
          road_street: form.road_street,
          building_name: form.building_name,
          door_number: form.door_number,
          contact_name: form.contact_name,
          phone: form.phone,
          whatsapp: form.whatsapp,
          website: form.website,
          email: form.email,
          description: form.short_description,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Submission failed')
      setSubmitted(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-border p-10 text-center max-w-md w-full"
        >
          <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-3">Submission Received!</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Thank you! Your business has been submitted and will appear in the directory once our team has reviewed it.
            Check your email for a confirmation message.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = '/directory'}>
              Browse Directory
            </Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm(EMPTY); setStep(1) }}>
              Submit Another
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-surface">
      <div className="bg-primary py-10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-white mb-2">List Your Business for Free</h1>
          <p className="text-white/75 text-sm">
            Get discovered by thousands of residents along Kiambu Road in 8 simple steps.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
          <ProgressBar step={step} />

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Step 1: Category */}
              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-5">Choose a Category</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => { set('category_name', cat.name); set('subcategory_name', '') }}
                        className={`text-left p-4 rounded-xl border-2 transition-all ${
                          form.category_name === cat.name
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-sm">{cat.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Subcategory */}
              {step === 2 && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-2">Choose a Subcategory</h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Category: <span className="font-semibold text-foreground">{form.category_name}</span>
                  </p>
                  {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCategory.subcategories.map((sub) => (
                        <button
                          key={sub.slug}
                          type="button"
                          onClick={() => set('subcategory_name', sub.name)}
                          className={`text-left p-4 rounded-xl border-2 transition-all ${
                            form.subcategory_name === sub.name
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="font-semibold text-sm">{sub.name}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground p-4 bg-muted rounded-xl">
                      No subcategories for this category. Click Next to continue.
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Business Name */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-5">Business Name</h2>
                  <div className="space-y-1.5">
                    <Label>Business Name *</Label>
                    <Input
                      value={form.business_name}
                      onChange={(e) => set('business_name', e.target.value)}
                      placeholder="e.g. Kiambu Road Pharmacy"
                      className="h-12 text-base"
                      autoFocus
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Location */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-5">Location Details</h2>
                  <div className="space-y-1.5">
                    <Label>Road / Street *</Label>
                    <Input
                      value={form.road_street}
                      onChange={(e) => set('road_street', e.target.value)}
                      placeholder="e.g. Kiambu Road, Thindigua"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Building Name (optional)</Label>
                    <Input
                      value={form.building_name}
                      onChange={(e) => set('building_name', e.target.value)}
                      placeholder="e.g. Ridgeways Shopping Centre"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Door / Office Number (optional)</Label>
                    <Input
                      value={form.door_number}
                      onChange={(e) => set('door_number', e.target.value)}
                      placeholder="e.g. 2nd Floor, Suite 204"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Contact Person */}
              {step === 5 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-5">Contact Person</h2>
                  <div className="space-y-1.5">
                    <Label>Contact Name *</Label>
                    <Input
                      value={form.contact_name}
                      onChange={(e) => set('contact_name', e.target.value)}
                      placeholder="e.g. John Kamau"
                    />
                  </div>
                </div>
              )}

              {/* Step 6: Phone & WhatsApp */}
              {step === 6 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-5">Phone & WhatsApp</h2>
                  <div className="space-y-1.5">
                    <Label>Phone Number *</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>WhatsApp Number (optional)</Label>
                    <Input
                      value={form.whatsapp}
                      onChange={(e) => set('whatsapp', e.target.value)}
                      placeholder="Same as phone, or different number"
                      type="tel"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to use your phone number for WhatsApp too.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 7: Online Presence & Description */}
              {step === 7 && (
                <div className="space-y-4">
                  <h2 className="font-display text-xl font-bold mb-5">Online Presence & Description</h2>
                  <div className="space-y-1.5">
                    <Label>Email Address *</Label>
                    <Input
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="your@email.com"
                      type="email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website (optional)</Label>
                    <Input
                      value={form.website}
                      onChange={(e) => set('website', e.target.value)}
                      placeholder="https://www.yourbusiness.com"
                      type="url"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Short Description * (max 25 words)</Label>
                    <Textarea
                      value={form.short_description}
                      onChange={(e) => set('short_description', e.target.value)}
                      placeholder="Briefly describe your business in 25 words or less..."
                      rows={3}
                    />
                    <p className={`text-xs text-right ${form.short_description.trim().split(/\s+/).filter(Boolean).length > 25 ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                      {form.short_description.trim().split(/\s+/).filter(Boolean).length} / 25 words
                    </p>
                  </div>
                </div>
              )}

              {/* Step 8: Review & Submit */}
              {step === 8 && (
                <div>
                  <h2 className="font-display text-xl font-bold mb-5">Review & Submit</h2>
                  <div className="bg-muted rounded-xl p-5 space-y-3 text-sm mb-6">
                    {[
                      { label: 'Category', value: form.category_name },
                      { label: 'Subcategory', value: form.subcategory_name || '—' },
                      { label: 'Business Name', value: form.business_name },
                      { label: 'Road / Street', value: form.road_street },
                      { label: 'Building', value: form.building_name || '—' },
                      { label: 'Door / Office', value: form.door_number || '—' },
                      { label: 'Contact Name', value: form.contact_name },
                      { label: 'Phone', value: form.phone },
                      { label: 'WhatsApp', value: form.whatsapp || form.phone },
                      { label: 'Email', value: form.email },
                      { label: 'Website', value: form.website || '—' },
                      { label: 'Description', value: form.short_description },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex gap-3">
                        <span className="text-muted-foreground font-mono text-xs w-28 shrink-0 pt-0.5">{label}</span>
                        <span className="text-foreground font-medium leading-snug">{value}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By submitting, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms & Conditions</a>.
                    Our team will review your listing within 1–2 business days.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={back} className="flex-1">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            {step < TOTAL_STEPS ? (
              <Button onClick={next} className="flex-1 bg-primary hover:bg-primary/90">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {loading ? 'Submitting...' : 'Submit Listing'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
