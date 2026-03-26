import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ArticleForm from '@/components/admin/article-form'

interface Props {
  params: Promise<{ id: string }>
}

async function getFormData(articleId: string) {
  const supabase = await createClient()
  const [{ data: article }, { data: sections }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', articleId).single(),
    supabase.from('journal_sections').select('id, name, slug').eq('status', 'published').order('sort_order'),
  ])
  return { article, sections: sections ?? [] }
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const { article, sections } = await getFormData(id)
  if (!article) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/articles" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold">Edit Article</h1>
          <p className="text-xs text-muted-foreground font-mono">{article.slug}</p>
        </div>
      </div>
      <ArticleForm article={article} sections={sections} mode="edit" />
    </div>
  )
}
