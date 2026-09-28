import type { ReactNode } from 'react'

/**
 * Renders plain-text content with a small convention so admins can write
 * structured campaign copy in a plain textarea:
 *  - a line starting with "## " becomes a subheading
 *  - consecutive lines starting with "- " become a bullet list
 *  - other consecutive non-blank lines are joined into a paragraph
 * Processes line-by-line rather than by blank-line blocks, since an intro
 * sentence or heading is often followed immediately (single newline) by its
 * bullet list in the source text.
 */
export default function SimpleMarkdown({ text }: { text: string }) {
  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let paragraphLines: string[] = []
  let listItems: string[] = []

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return
    nodes.push(
      <p key={nodes.length} className="text-sm text-muted-foreground leading-relaxed">
        {paragraphLines.join(' ')}
      </p>
    )
    paragraphLines = []
  }

  const flushList = () => {
    if (listItems.length === 0) return
    nodes.push(
      <ul key={nodes.length} className="space-y-2">
        {listItems.map((item, j) => (
          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary font-bold mt-0.5">✓</span>
            {item}
          </li>
        ))}
      </ul>
    )
    listItems = []
  }

  for (const rawLine of lines) {
    const line = rawLine.trim()

    if (line === '') {
      flushParagraph()
      flushList()
      continue
    }

    if (line.startsWith('## ')) {
      flushParagraph()
      flushList()
      nodes.push(
        <h3 key={nodes.length} className="font-display text-lg font-bold text-foreground pt-2">
          {line.slice(3)}
        </h3>
      )
      continue
    }

    if (line.startsWith('- ')) {
      flushParagraph()
      listItems.push(line.slice(2))
      continue
    }

    flushList()
    paragraphLines.push(line)
  }

  flushParagraph()
  flushList()

  return <div className="space-y-4">{nodes}</div>
}
