import { remark } from 'remark'
import remarkHtml from 'remark-html'

/**
 * Converts a markdown string to an HTML string.
 * Used by page and post components to render content from .md files.
 *
 * sanitize: false is intentional — content is codebase-authored and uses
 * raw HTML (e.g. <table>, <iframe>). The CSP in next.config.ts is the
 * backstop against script injection if a file were ever compromised.
 */
export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content)
  return result.toString()
}
