import type hast from 'hast'
import behead from 'remark-behead'
import remarkBreaks from 'remark-breaks'
import rehypeHighlight from 'rehype-highlight'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import { unified, type Processor, type Transformer } from 'unified'
import type { Node } from 'unist'
import { visit } from 'unist-util-visit'

const prose = 'prose prose-p:!text-sm prose-sm prose-neutral max-w-none prose-strong:text-gray-plain'
const proseTable = 'prose-table:bg-neutral-200 prose-table:!overflow-visible first-of-type:prose-tr:!bg-neutral-200 first-of-type:prose-tr:border-b-2 first-of-type:prose-tr:border-black odd:prose-tr:bg-neutral-300 *:prose-th:m-0 *:prose-td:m-0 prose-th:p-4 prose-td:p-4'
const proseHeading = 'prose-h2:!text-2xl prose-h2:!leading-7 prose-h3:!text-xl prose-h3:!leading-6 prose-h4:!text-base prose-h5:!text-sm prose-h5:!leading-6 prose-headings:!font-extrabold'
const proseList = 'prose-ul:list-disc'
const proseCode = 'prose-pre:font-mono prose-pre:bg-neutral-200 prose-pre:text-neutral-600'
const proseOthers = 'prose-blockquote:border-neutral-800 prose-a:no-underline prose-a:text-gray-plain prose-a:font-[number:inherit] prose-li:p-0 *:prose-li:m-0'

export const markdownClasses = [prose, proseTable, proseHeading, proseList, proseCode, proseOthers].join(' ')

// Copied from https://github.com/potato4d/rehype-plugin-image-native-lazy-loading/blob/v1.2.0/src/index.ts
function lazyLoadPlugin(this: Processor): Transformer {
  function visitor(el: hast.Element) {
    if (el.tagName !== 'img') {
      return
    }
    el.properties = {
      ...(el.properties || {}),
      loading: 'lazy',
    }
  }

  function transformer(htmlAST: Node): Node {
    visit(htmlAST, 'element', visitor)
    return htmlAST
  }

  return transformer
}

export function formatMarkdown(md: string, minDepth = 3) {
  const result = unified()
    // somehow this type is working when `minDepth` is required but not when it has a default value
    .use(behead, { minDepth })
    // Take Markdown as input and turn it into MD syntax tree
    .use(remarkParse, { fragment: true })
    .use(remarkBreaks)
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
    .use(rehypeSanitize)
    // Serialize syntax tree to HTML
    .use(rehypeStringify)
    .use(lazyLoadPlugin)
    // And finally, process the input
    .processSync(md)

  return String(result)
}
