'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2, UploadCloud, X, FileText } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface FileUploadFieldProps {
  label: string
  bucket: string
  /** Optional folder prefix inside the bucket, e.g. 'agency-services' */
  folder?: string
  accept: string
  maxBytes?: number
  /** Currently stored path (not a full URL) — shown as the existing value */
  value: string
  onChange: (path: string) => void
  /** Set true for private buckets where a public preview URL won't resolve — shows a filename instead of an image */
  isPrivate?: boolean
  publicUrlBase?: string
}

const DEFAULT_MAX_BYTES = 5 * 1024 * 1024

export default function FileUploadField({
  label,
  bucket,
  folder,
  accept,
  maxBytes = DEFAULT_MAX_BYTES,
  value,
  onChange,
  isPrivate = false,
  publicUrlBase,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const previewUrl = value && !isPrivate
    ? publicUrlBase
      ? `${publicUrlBase}/${value}`
      : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${value}`
    : null

  const acceptedTypes = accept.split(',').map((t) => t.trim())

  const handleFile = async (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error('File type not accepted.')
      return
    }
    if (file.size > maxBytes) {
      toast.error(`File must be under ${Math.round(maxBytes / (1024 * 1024))} MB.`)
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `${folder ? `${folder}/` : ''}${crypto.randomUUID()}.${ext}`

      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      })
      if (error) throw error

      onChange(path)
      toast.success('File uploaded')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>

      {value ? (
        <div className="flex items-center gap-3 border border-border rounded-lg p-3">
          {previewUrl ? (
            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
              <Image src={previewUrl} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
          <p className="text-xs text-muted-foreground font-mono truncate flex-1">{value}</p>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-6 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-60"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
          {uploading ? 'Uploading...' : 'Click to upload'}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
