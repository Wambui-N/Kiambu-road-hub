import Image from 'next/image'
import { cn } from '@/lib/utils'

type AnyBlock = Record<string, any>

const LIST_ITEM_TYPES = new Set(['bulletListItem', 'numberedListItem', 'checkListItem'])

const HEADING_CLASSES: Record<number, string> = {
  1: 'text-2xl sm:text-3xl font-bold mt-2',
  2: 'text-xl sm:text-2xl font-bold mt-2',
  3: 'text-lg sm:text-xl font-semibold mt-2',
  4: 'text-base sm:text-lg font-semibold mt-2',
  5: 'text-base font-semibold mt-2',
  6: 'text-sm font-semibold mt-2 uppercase tracking-wide',
}

function mediaUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/article-media/${path}`
}

function hasVisibleText(content: unknown): boolean {
  if (typeof content === 'string') return content.trim().length > 0
  if (!Array.isArray(content)) return false
  return content.some((item: AnyBlock) => {
    if (!item || typeof item !== 'object') return false
    if (item.type === 'text') return typeof item.text === 'string' && item.text.length > 0
    if (item.type === 'link') return hasVisibleText(item.content)
    return false
  })
}

function InlineContent({ content }: { content: unknown }) {
  if (typeof content === 'string') return <>{content}</>
  if (!Array.isArray(content)) return null

  return (
    <>
      {content.map((item: AnyBlock, i: number) => {
        if (!item || typeof item !== 'object') return null

        if (item.type === 'link') {
          return (
            <a
              key={i}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:no-underline"
            >
              <InlineContent content={item.content} />
            </a>
          )
        }

        if (item.type === 'text') {
          const styles = item.styles ?? {}
          let node: React.ReactNode = item.text as string
          if (styles.code) node = <code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">{node}</code>
          if (styles.bold) node = <strong>{node}</strong>
          if (styles.italic) node = <em>{node}</em>
          if (styles.underline) node = <u>{node}</u>
          if (styles.strike) node = <s>{node}</s>
          return (
            <span key={i} style={styles.textColor ? { color: styles.textColor } : undefined}>
              {node}
            </span>
          )
        }

        return null
      })}
    </>
  )
}

function renderListGroup(type: string, items: AnyBlock[], key: React.Key) {
  const isOrdered = type === 'numberedListItem'
  const isCheck = type === 'checkListItem'
  const Tag = isOrdered ? 'ol' : 'ul'

  return (
    <Tag
      key={key}
      className={cn(
        'space-y-1.5 text-muted-foreground leading-relaxed',
        isOrdered ? 'list-decimal pl-6' : isCheck ? 'list-none pl-0' : 'list-disc pl-6',
      )}
    >
      {items.map((item, i) => (
        <li key={item.id ?? i} className={isCheck ? 'flex items-start gap-2' : undefined}>
          {isCheck && (
            <input
              type="checkbox"
              checked={!!item.props?.checked}
              disabled
              className="mt-1 accent-primary shrink-0"
            />
          )}
          <span>
            <InlineContent content={item.content} />
            {Array.isArray(item.children) && item.children.length > 0 && (
              <div className="mt-1.5 space-y-3">{renderBlocks(item.children)}</div>
            )}
          </span>
        </li>
      ))}
    </Tag>
  )
}

function renderBlock(block: AnyBlock, key: React.Key): React.ReactNode {
  const nestedChildren = Array.isArray(block.children) && block.children.length > 0
    ? <div className="pl-6 mt-2 space-y-3">{renderBlocks(block.children)}</div>
    : null

  switch (block.type) {
    case 'heading': {
      const level = Math.min(Math.max(Number(block.props?.level) || 2, 1), 6)
      const Tag = `h${Math.min(level + 1, 6)}` as keyof React.JSX.IntrinsicElements
      if (!hasVisibleText(block.content)) return null
      return (
        <div key={key}>
          <Tag className={cn('font-display text-foreground', HEADING_CLASSES[level])}>
            <InlineContent content={block.content} />
          </Tag>
          {nestedChildren}
        </div>
      )
    }

    case 'paragraph': {
      if (!hasVisibleText(block.content)) return null
      return (
        <div key={key}>
          <p className="text-muted-foreground leading-relaxed">
            <InlineContent content={block.content} />
          </p>
          {nestedChildren}
        </div>
      )
    }

    case 'quote': {
      if (!hasVisibleText(block.content)) return null
      return (
        <div key={key}>
          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
            <InlineContent content={block.content} />
          </blockquote>
          {nestedChildren}
        </div>
      )
    }

    case 'codeBlock': {
      if (!hasVisibleText(block.content)) return null
      return (
        <pre key={key} className="bg-muted rounded-lg p-4 overflow-x-auto text-xs font-mono text-foreground">
          <code>
            <InlineContent content={block.content} />
          </code>
        </pre>
      )
    }

    case 'image': {
      const url = block.props?.url
      if (!url) return null
      return (
        <figure key={key} className="my-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
            <Image
              src={mediaUrl(url)}
              alt={block.props?.caption || block.props?.name || ''}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 768px"
            />
          </div>
          {block.props?.caption && (
            <figcaption className="text-xs text-muted-foreground text-center mt-2">{block.props.caption}</figcaption>
          )}
        </figure>
      )
    }

    case 'video': {
      const url = block.props?.url
      if (!url) return null
      return (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video key={key} controls src={mediaUrl(url)} className="w-full rounded-xl bg-black my-2" />
      )
    }

    case 'audio': {
      const url = block.props?.url
      if (!url) return null
      return <audio key={key} controls src={mediaUrl(url)} className="w-full my-2" />
    }

    case 'file': {
      const url = block.props?.url
      if (!url) return null
      return (
        <a
          key={key}
          href={mediaUrl(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline my-2"
        >
          📎 {block.props?.name || 'Download file'}
        </a>
      )
    }

    case 'table': {
      const rows = block.content?.rows ?? []
      const headerRows = Number(block.content?.headerRows) || 0
      if (rows.length === 0) return null
      return (
        <div key={key} className="overflow-x-auto my-2">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <tbody>
              {rows.map((row: AnyBlock, ri: number) => (
                <tr key={ri} className={ri < headerRows ? 'bg-muted font-semibold' : undefined}>
                  {(row.cells ?? []).map((cell: AnyBlock, ci: number) => {
                    const cellContent = Array.isArray(cell) ? cell : cell?.content
                    return (
                      <td key={ci} className="border border-border px-3 py-2 align-top">
                        <InlineContent content={cellContent} />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    case 'toggleListItem': {
      if (!hasVisibleText(block.content)) return null
      return (
        <details key={key} className="my-2">
          <summary className="cursor-pointer font-medium text-foreground">
            <InlineContent content={block.content} />
          </summary>
          {nestedChildren}
        </details>
      )
    }

    case 'divider':
      return <hr key={key} className="border-border my-6" />

    default:
      return null
  }
}

function renderBlocks(blocks: AnyBlock[]): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (LIST_ITEM_TYPES.has(block.type)) {
      const listType = block.type
      const group: AnyBlock[] = []
      while (i < blocks.length && blocks[i].type === listType) {
        group.push(blocks[i])
        i++
      }
      nodes.push(renderListGroup(listType, group, group[0]?.id ?? nodes.length))
      continue
    }

    nodes.push(renderBlock(block, block.id ?? i))
    i++
  }

  return nodes
}

interface ArticleContentProps {
  body: Record<string, unknown> | null
}

export default function ArticleContent({ body }: ArticleContentProps) {
  const blocks = Array.isArray((body as { blocks?: unknown })?.blocks)
    ? ((body as { blocks: AnyBlock[] }).blocks)
    : []

  const rendered = renderBlocks(blocks).filter(Boolean)

  if (rendered.length === 0) {
    return <p className="text-muted-foreground">Article content is being prepared.</p>
  }

  return <div className="space-y-4">{rendered}</div>
}
