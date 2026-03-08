// 个人信息
export interface Profile {
  name: string
  title: string
  avatar: string
  bio: string
  skills: Skill[]
  social: SocialLinks
}

export interface Skill {
  name: string
  level: number // 1-100
  category: "frontend" | "backend" | "tools" | "other"
}

export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  email?: string
  website?: string
}

// 项目
export interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  images?: string[]
  techStack: string[]
  demoUrl?: string
  sourceUrl?: string
  featured: boolean
  status: "developing" | "completed" | "archived"
}

// 博客文章
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

// 工作经历
export interface Experience {
  id: string
  company: string
  position: string
  period: string
  description: string
  technologies?: string[]
}

// 教育背景
export interface Education {
  id: string
  school: string
  degree: string
  major: string
  period: string
  description?: string
}
