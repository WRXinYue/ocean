/**
 * Get meta information from Markdown string and the article content without the front matter.
 * @param md - The Markdown string containing front matter.
 * @returns An object with "meta" (array of meta lines) and "content" (article content without front matter).
 */
export function getArticle(md: string) {
  const frontMatter = md.split('---')[1]
  const meta = frontMatter.split('\n')
  const content = md.replace(`---${frontMatter}---`, '').trim()

  return {
    meta,
    content,
  }
}

/**
 * Parse meta to dictionary.
 * @param meta - The meta string to parse.
 * @returns The parsed dictionary.
 */
export function parseArticleMeta(meta: string[]) {
  const dict: Record<'tags' | 'categories', string[]> = {
    tags: [],
    categories: [],
  }

  for (let i = 0; i < meta.length; i++) {
    const line = meta[i].trim()
    if (line.includes(':')) {
      const splitLine = line.split(':')
      const key = splitLine[0].trim()
      // const value = splitLine[1].trim()

      if (key === 'tags' || key === 'categories') {
        // If it's a list item, keep reading lines until finished
        dict[key] = []
        for (let j = i + 1; j < meta.length; j++) {
          if (meta[j].trim().startsWith('-')) {
            dict[key].push(meta[j].trim().substring(1).trim())
          }
          else {
            // If the next line does not start with a dash ('-'), it's not part of the list
            i = j - 1
            break
          }
        }
      }
      // else {
      //   dict[key] = value
      // }
    }
  }

  return dict
}
