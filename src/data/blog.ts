import { createBlogPost, type BlogPost } from '../utils/markdown'

// 使用 Vite 的 import.meta.glob 导入所有 markdown 文件
const markdownFiles = import.meta.glob<{ default: string }>(
  '../content/blog/*.md',
  { eager: true }
)

// 解析所有博客文章
export const blogPosts: BlogPost[] = Object.entries(markdownFiles)
  .map(([path, module]) => {
    // 从文件路径提取 slug
    const slug = path.match(/\/([^/]+)\.md$/)?.[1] || ''
    return createBlogPost(slug, module.default)
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