import matter from 'gray-matter'

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
 * 解析 Markdown 文件的 frontmatter 和内容
 */
export function parseMarkdown(markdown: string): {
  frontmatter: BlogPostFrontmatter
  content: string
} {
  const { data, content } = matter(markdown)
  return {
    frontmatter: data as BlogPostFrontmatter,
    content: content.trim(),
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