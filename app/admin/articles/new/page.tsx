import { createClient } from '@/lib/supabase/server'
import ArticleForm from '@/components/admin/article-form'

async function getJournalSections() {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('journal_sections').select('id, name, slug').order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

export default async function NewArticlePage() {
  const sections = await getJournalSections()
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Write Article</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Create a new journal article</p>
      </div>
      <ArticleForm sections={sections} />
    </div>
  )
}
