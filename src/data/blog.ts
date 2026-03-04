import { createBlogPost, type BlogPost } from '../utils/markdown'

// 使用 Vite 的 ?raw 后缀导入 markdown 文件作为字符串
// 支持两种结构：
// 1. 分类存放：src/content/blog/分类名/*.md
// 2. 单独存放：src/content/blog/*.md
const modules = import.meta.glob<string>(
  '../content/blog/**/*.md',
  { eager: true, query: '?raw', import: 'default' }
)

// 解析所有博客文章
export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([path, content]) => {
    // 从文件路径提取 slug 和分类
    // 路径格式: ../content/blog/分类名/slug.md 或 ../content/blog/slug.md
    const match = path.match(/\/content\/blog\/(?:([^/]+)\/)?([^/]+)\.md$/)
    const category = match?.[1] || '默认'
    const slug = match?.[2] || ''
    const post = createBlogPost(slug, content)
    // 如果 frontmatter 中没有指定分类，使用目录名作为分类
    if (!post.category || post.category === '默认') {
      post.category = category
    }
    // 保存完整路径slug（包含分类），用于路由匹配
    ;(post as BlogPost & { fullSlug: string }).fullSlug = category === '默认' ? slug : `${category}/${slug}`
    return post
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// 获取置顶文章
export function getPinnedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.pinned)
}

// 获取非置顶文章
export function getNonPinnedPosts(): BlogPost[] {
  return blogPosts.filter((post) => !post.pinned)
}

// 根据 slug 获取单篇文章
// 支持两种格式：纯 slug（如 react-19）或完整路径（如 技术/react-19）
export function getBlogPost(slug: string): BlogPost | undefined {
  // 首先尝试精确匹配
  const exactMatch = blogPosts.find((post) => (post as BlogPost & { fullSlug: string }).fullSlug === slug)
  if (exactMatch) return exactMatch

  // 然后尝试纯 slug 匹配（向后兼容）
  return blogPosts.find((post) => post.slug === slug)
}

// 获取所有文章 slug (用于路由预加载)
export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => (post as BlogPost & { fullSlug: string }).fullSlug)
}

// 按标签筛选文章
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag))
}

// 按分类筛选文章
export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

// 获取所有分类及其文章数量
export function getAllCategories(): { name: string; count: number }[] {
  const categoryMap = new Map<string, number>()
  blogPosts.forEach((post) => {
    const count = categoryMap.get(post.category) || 0
    categoryMap.set(post.category, count + 1)
  })
  return Array.from(categoryMap.entries()).map(([name, count]) => ({
    name,
    count,
  }))
}