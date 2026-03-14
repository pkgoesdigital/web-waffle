import { remark } from 'remark'
import remarkHtml from 'remark-html'

/**
 * Converts a markdown string to an HTML string.
 * Used by page and post components to render content from .md files.
 *
 * sanitize: false allows raw HTML in markdown (e.g. <iframe>, <video>)
 * since content is authored directly in the codebase.
 */
export async function markdownToHtml(content: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(content)
  return result.toString()
}
