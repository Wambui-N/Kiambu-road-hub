'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, Plus, Pencil, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { slugify } from '@/lib/utils'

interface Subcategory {
  id: string
  name: string
  slug: string
  sort_order: number
  status: string
}

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
  description: string | null
  sort_order: number
  status: string
  business_count: number
  subcategories: Subcategory[]
}

interface CategoryManagerProps {
  categories: Category[]
}

const STATUS_STYLE: Record<string, string> = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-muted text-muted-foreground',
  archived: 'bg-red-100 text-red-700',
}

export default function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null)
  const [newSubName, setNewSubName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)
  const [newCatForm, setNewCatForm] = useState({ name: '', description: '', color: '#1B6B3A' })
  const [loading, setLoading] = useState(false)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startEdit = (cat: Category) => {
    setEditingId(cat.id)
    setEditValues({
      name: cat.name,
      description: cat.description ?? '',
      color: cat.color ?? '#1B6B3A',
      status: cat.status,
    })
  }

  const saveCategory = async (catId: string) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('categories')
        .update({
          name: editValues.name,
          description: editValues.description,
          color: editValues.color,
          status: editValues.status,
        })
        .eq('id', catId)
      if (error) throw error
      toast.success('Category updated')
      setEditingId(null)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleCategoryStatus = async (catId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('categories').update({ status: newStatus }).eq('id', catId)
      if (error) throw error
      toast.success(`Category ${newStatus}`)
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const addSubcategory = async (catId: string) => {
    if (!newSubName.trim()) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('subcategories').insert({
        category_id: catId,
        name: newSubName.trim(),
        slug: slugify(newSubName.trim()),
        status: 'published',
        sort_order: 99,
      })
      if (error) throw error
      toast.success('Subcategory added')
      setAddingSubFor(null)
      setNewSubName('')
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Add failed')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCatForm.name.trim()) return
    setLoading(true)
    try {
      const supabase = createClient()
      const maxOrder = Math.max(0, ...categories.map((c) => c.sort_order))
      const { error } = await supabase.from('categories').insert({
        name: newCatForm.name.trim(),
        slug: slugify(newCatForm.name.trim()),
        description: newCatForm.description.trim() || null,
        color: newCatForm.color,
        status: 'draft',
        sort_order: maxOrder + 1,
      })
      if (error) throw error
      toast.success('Category created (status: draft)')
      setAddingCategory(false)
      setNewCatForm({ name: '', description: '', color: '#1B6B3A' })
      router.refresh()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Add category button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setAddingCategory((v) => !v)}
          className="bg-primary hover:bg-primary/90"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </Button>
      </div>

      {/* New category form */}
      {addingCategory && (
        <div className="bg-white rounded-xl border border-primary/30 p-5 space-y-3">
          <h3 className="font-semibold text-sm">New Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              placeholder="Category name"
              value={newCatForm.name}
              onChange={(e) => setNewCatForm((v) => ({ ...v, name: e.target.value }))}
            />
            <Input
              placeholder="Description (optional)"
              value={newCatForm.description}
              onChange={(e) => setNewCatForm((v) => ({ ...v, description: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-muted-foreground font-mono">Color</label>
            <input
              type="color"
              value={newCatForm.color}
              onChange={(e) => setNewCatForm((v) => ({ ...v, color: e.target.value }))}
              className="w-8 h-8 rounded cursor-pointer border border-border"
            />
            <span className="text-xs font-mono text-muted-foreground">{newCatForm.color}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={addCategory} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90">
              <Check className="w-3 h-3 mr-1" /> Save Category
            </Button>
            <Button onClick={() => setAddingCategory(false)} variant="ghost" size="sm">
              <X className="w-3 h-3 mr-1" /> Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Category list */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-4">🗂️</p>
            <h3 className="font-semibold mb-2">No categories yet</h3>
            <p className="text-sm text-muted-foreground">
              Add your first category or seed from the migration data.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat) => {
              const isExpanded = expandedIds.has(cat.id)
              const isEditing = editingId === cat.id

              return (
                <div key={cat.id}>
                  {/* Category row */}
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                    <button
                      onClick={() => toggleExpand(cat.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {/* Color dot */}
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color ?? '#64748B' }}
                    />

                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <Input
                          value={editValues.name}
                          onChange={(e) => setEditValues((v) => ({ ...v, name: e.target.value }))}
                          className="h-7 text-sm w-48"
                        />
                        <Input
                          value={editValues.description}
                          onChange={(e) => setEditValues((v) => ({ ...v, description: e.target.value }))}
                          className="h-7 text-sm flex-1 min-w-[160px]"
                          placeholder="Description"
                        />
                        <input
                          type="color"
                          value={editValues.color}
                          onChange={(e) => setEditValues((v) => ({ ...v, color: e.target.value }))}
                          className="w-7 h-7 rounded cursor-pointer border border-border"
                        />
                        <select
                          value={editValues.status}
                          onChange={(e) => setEditValues((v) => ({ ...v, status: e.target.value }))}
                          className="h-7 px-2 rounded border border-border text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          onClick={() => saveCategory(cat.id)}
                          disabled={loading}
                          className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-xs px-2 py-1 border border-border rounded hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="font-medium text-sm truncate">{cat.name}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${STATUS_STYLE[cat.status] ?? ''}`}>
                          {cat.status}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono ml-auto shrink-0">
                          {cat.subcategories.length} subs · {cat.business_count} businesses
                        </span>
                        <button
                          onClick={() => startEdit(cat)}
                          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div className="bg-muted/30 border-t border-border">
                      {cat.subcategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-3 px-8 py-2 border-b border-border/50 last:border-0"
                        >
                          <span className="text-muted-foreground text-xs">└</span>
                          <span className="text-sm flex-1">{sub.name}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">{sub.slug}</span>
                          <span className={cn('text-[10px] font-mono px-2 py-0.5 rounded-full', STATUS_STYLE[sub.status] ?? '')}>
                            {sub.status}
                          </span>
                        </div>
                      ))}

                      {/* Add subcategory */}
                      {addingSubFor === cat.id ? (
                        <div className="flex items-center gap-2 px-8 py-2">
                          <Input
                            placeholder="Subcategory name"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            className="h-7 text-sm flex-1"
                            onKeyDown={(e) => { if (e.key === 'Enter') addSubcategory(cat.id) }}
                            autoFocus
                          />
                          <button
                            onClick={() => addSubcategory(cat.id)}
                            disabled={loading}
                            className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary/90"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => { setAddingSubFor(null); setNewSubName('') }}
                            className="text-xs px-2 py-1 border border-border rounded hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setAddingSubFor(cat.id); setExpandedIds((s) => new Set([...s, cat.id])) }}
                          className="flex items-center gap-2 px-8 py-2 text-xs text-muted-foreground hover:text-primary transition-colors w-full text-left"
                        >
                          <Plus className="w-3 h-3" /> Add subcategory
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
