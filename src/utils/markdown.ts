export interface BlogPostFrontmatter {
  title: string
  excerpt: string
  date: string
  tags: string[]
  category: string
  readTime: number
  coverImage?: string
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  category: string
  date: string
  readTime: number
}

/**
 * 解析 YAML frontmatter（轻量实现，不依赖 gray-matter）
 */
function parseFrontmatter(markdown: string): { frontmatter: Record<string, unknown>; content: string } {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)

  if (!match) {
    return { frontmatter: {}, content: markdown.trim() }
  }

  const [, frontmatterStr, content] = match
  const frontmatter: Record<string, unknown> = {}

  // 解析 YAML 格式的 frontmatter
  const lines = frontmatterStr.split('\n')
  let currentKey = ''

  for (const line of lines) {
    // 匹配 key: value 格式
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/)
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch
      currentKey = key

      // 处理数组类型（tags）
      if (value === '') {
        frontmatter[key] = []
      } else if (value.startsWith('[') && value.endsWith(']')) {
        // 单行数组格式: [item1, item2]
        frontmatter[key] = value
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^['"]|['"]$/g, ''))
      } else {
        // 普通值，移除引号
        frontmatter[key] = value.replace(/^['"]|['"]$/g, '')
      }
    } else if (line.startsWith('  - ') && currentKey) {
      // 多行数组项
      const arrayValue = line.slice(4).trim().replace(/^['"]|['"]$/g, '')
      ;(frontmatter[currentKey] as string[]).push(arrayValue)
    }
  }

  return { frontmatter, content: content.trim() }
}

/**
 * 解析 Markdown 文件的 frontmatter 和内容
 */
export function parseMarkdown(markdown: string): {
  frontmatter: BlogPostFrontmatter
  content: string
} {
  const { frontmatter, content } = parseFrontmatter(markdown)
  return {
    frontmatter: frontmatter as BlogPostFrontmatter,
    content,
  }
}

/**
 * 从 Markdown 原始内容创建 BlogPost 对象
 */
export function createBlogPost(slug: string, markdown: string): BlogPost {
  const { frontmatter, content } = parseMarkdown(markdown)
  return {
    slug,
    title: frontmatter.title,
    excerpt: frontmatter.excerpt,
    content,
    coverImage: frontmatter.coverImage,
    tags: frontmatter.tags,
    category: frontmatter.category,
    date: frontmatter.date,
    readTime: frontmatter.readTime,
  }
}