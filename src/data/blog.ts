import { createBlogPost, type BlogPost } from '../utils/markdown'

// 使用 Vite 的 ?raw 后缀导入 markdown 文件作为字符串
const modules = import.meta.glob<string>(
  '../content/blog/*.md',
  { eager: true, query: '?raw', import: 'default' }
)

// 解析所有博客文章
export const blogPosts: BlogPost[] = Object.entries(modules)
  .map(([path, content]) => {
    // 从文件路径提取 slug
    const slug = path.match(/\/([^/]+)\.md$/)?.[1] || ''
    return createBlogPost(slug, content)
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// 根据 slug 获取单篇文章
export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

// 获取所有文章 slug (用于路由预加载)
export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug)
}

// 按标签筛选文章
export function getBlogPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter((post) => post.tags.includes(tag))
}

// 按分类筛选文章
export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}