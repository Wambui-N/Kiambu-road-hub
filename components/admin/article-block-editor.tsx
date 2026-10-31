'use client'

import { forwardRef, useImperativeHandle } from 'react'
import type { PartialBlock } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { createClient } from '@/lib/supabase/client'

import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'

export interface ArticleBlockEditorHandle {
  getBlocks: () => PartialBlock[]
}

interface ArticleBlockEditorProps {
  initialBlocks?: PartialBlock[]
}

async function uploadToArticleMedia(file: File): Promise<string> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() || 'png'
  const path = `blocks/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from('article-media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-media/${path}`
}

const ArticleBlockEditor = forwardRef<ArticleBlockEditorHandle, ArticleBlockEditorProps>(
  function ArticleBlockEditor({ initialBlocks }, ref) {
    const editor = useCreateBlockNote({
      initialContent: initialBlocks && initialBlocks.length > 0 ? initialBlocks : undefined,
      uploadFile: uploadToArticleMedia,
    })

    useImperativeHandle(ref, () => ({
      getBlocks: () => editor.document,
    }), [editor])

    return (
      <div className="rounded-lg border border-border overflow-hidden min-h-[320px]">
        <BlockNoteView editor={editor} theme="light" />
      </div>
    )
  },
)

export default ArticleBlockEditor
