/**
 * Renders plain-text content with a small convention so admins can write
 * structured campaign copy in a plain textarea:
 *  - a line starting with "## " becomes a subheading
 *  - consecutive lines starting with "- " become a bullet list
 *  - blank-line-separated blocks become paragraphs
 */
export default function SimpleMarkdown({ text }: { text: string }) {
  const blocks = text.split(/\n\n+/)

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter((l) => l.trim().length > 0)
        if (lines.length === 0) return null

        if (lines[0].startsWith('## ')) {
          return (
            <h3 key={i} className="font-display text-lg font-bold text-foreground pt-2">
              {lines[0].slice(3)}
            </h3>
          )
        }

        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="space-y-2">
              {lines.map((l, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">✓</span>
                  {l.slice(2)}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={i} className="text-sm text-muted-foreground leading-relaxed">
            {block}
          </p>
        )
      })}
    </div>
  )
}
