import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

async function getArticles() {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, status, published_at, featured, section:journal_sections(name)')
      .order('created_at', { ascending: false })
      .limit(100)
    return data ?? []
  } catch {
    return []
  }
}

const STATUS_COLOR: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  review: 'bg-amber-100 text-amber-700',
  published: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-700',
}

export default async function AdminArticlesPage() {
  const articles = await getArticles()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Articles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{articles.length} articles</p>
        </div>
        <Link href="/admin/articles/new">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-1" /> Write Article
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">📝</p>
            <h3 className="font-semibold mb-2">No articles yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Create your first journal article.</p>
            <Link href="/admin/articles/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-1" /> Write Article
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Section</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Published</th>
                  <th className="text-left px-4 py-3 font-mono text-xs text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium truncate max-w-[240px]">{article.title}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{article.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {(article.section as { name?: string })?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_COLOR[article.status] ?? ''}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {article.published_at ? new Date(article.published_at).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link href={`/admin/articles/${article.id}`} className="text-xs text-primary hover:underline">Edit</Link>
                        <Link href={`/journal/article/${article.slug}`} target="_blank" className="text-xs text-muted-foreground hover:text-foreground">
                          <Eye className="w-3 h-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
