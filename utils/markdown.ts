import { unified } from 'unified'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import behead from 'remark-behead'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import remarkMDC from 'remark-mdc'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'

export function formatMarkdown(md: string, minDepth = 3) {
  return unified()
    .use(behead, { minDepth })
  // Take Markdown as input and turn it into MD syntax tree
    .use(remarkParse, { fragment: true })
    .use(remarkBreaks)
  // Use `remark-mdc` plugin to parse MDC syntax
    .use(remarkMDC)
  // Switch from MD syntax tree to HTML syntax tree (remakr -> rehype)
    .use(remarkRehype, {
    // Necessary for support HTML embeds (see next plugin)
      allowDangerousHtml: true,
    })
  // Support HTML embedded inside markdown
    .use(rehypeRaw)
  // Improve code highlighting
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeSanitize)
  // Serialize syntax tree to HTML
    .use(rehypeStringify)
  // And finally, process the input
    .processSync(md)
}
