# 个人网站技术方案

## 一、项目概述

构建一个现代化的个人网站，展示个人信息、技能、项目作品和博客文章。

## 二、技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      前端层                              │
│  React 18 + Vite + TypeScript + Tailwind CSS            │
└─────────────────────────────────────────────────────────┘
                            ↓ REST API
┌─────────────────────────────────────────────────────────┐
│                      后端层                              │
│  NestJS + TypeScript + JWT认证 + Swagger文档            │
└─────────────────────────────────────────────────────────┘
                            ↓ Mongoose
┌─────────────────────────────────────────────────────────┐
│                      数据层                              │
│  MongoDB (文档数据库)                                    │
└─────────────────────────────────────────────────────────┘
```

## 三、前端技术栈

### 3.1 核心框架
- **React 18** - UI框架
- **Vite 5** - 构建工具，快速开发体验
- **TypeScript** - 类型安全

### 3.2 UI/样式
- **Tailwind CSS** - 原子化CSS框架
- **Framer Motion** - 动画库
- **Lucide React** - 图标库

### 3.3 状态管理与请求
- **Zustand** - 轻量级状态管理
- **TanStack Query (React Query)** - 服务端状态管理
- **Axios** - HTTP请求库

### 3.4 路由与工具
- **React Router v6** - 路由管理
- **React Hook Form** - 表单处理
- **Zod** - 数据验证

## 四、后端技术栈

### 4.1 核心框架
- **NestJS 10** - Node.js企业级框架
- **TypeScript** - 类型安全

### 4.2 数据库与ORM
- **MongoDB** - 文档数据库
- **Mongoose** - MongoDB对象建模工具

### 4.3 安全与认证
- **JWT** - 身份认证
- **Passport** - 认证中间件
- **bcrypt** - 密码加密
- **helmet** - 安全HTTP头
- **class-validator** - 数据验证

### 4.4 文档与工具
- **Swagger/OpenAPI** - API文档
- **Compodoc** - 代码文档

## 五、项目结构

```
AboutMe/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/          # 可复用组件
│   │   │   ├── common/          # 通用组件
│   │   │   ├── layout/          # 布局组件
│   │   │   └── features/        # 功能组件
│   │   ├── pages/               # 页面组件
│   │   ├── hooks/               # 自定义Hooks
│   │   ├── services/            # API服务
│   │   ├── stores/              # Zustand状态
│   │   ├── types/               # TypeScript类型
│   │   ├── utils/               # 工具函数
│   │   ├── styles/              # 全局样式
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── modules/             # 功能模块
│   │   │   ├── auth/            # 认证模块
│   │   │   ├── user/            # 用户模块
│   │   │   ├── blog/            # 博客模块
│   │   │   ├── project/         # 项目模块
│   │   │   └── contact/         # 联系表单模块
│   │   ├── common/              # 公共资源
│   │   │   ├── decorators/      # 自定义装饰器
│   │   │   ├── filters/         # 异常过滤器
│   │   │   ├── guards/          # 守卫
│   │   │   ├── interceptors/    # 拦截器
│   │   │   └── pipes/           # 管道
│   │   ├── config/              # 配置文件
│   │   ├── database/            # 数据库配置
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
│
├── docs/                        # 文档目录
│   └── api/                     # API文档
│
├── .gitignore
├── docker-compose.yml           # Docker编排
└── README.md
```

## 六、数据库设计

### 6.1 用户集合 (users)
```typescript
{
  _id: ObjectId,
  username: string,          // 用户名
  email: string,             // 邮箱
  password: string,          // 密码(加密)
  avatar: string,            // 头像URL
  bio: string,               // 个人简介
  skills: string[],          // 技能列表
  socialLinks: {              // 社交链接
    github: string,
    linkedin: string,
    twitter: string,
    website: string
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 6.2 博客集合 (blogs)
```typescript
{
  _id: ObjectId,
  title: string,             // 标题
  slug: string,              // URL友好的标识符
  content: string,          // 内容(Markdown)
  excerpt: string,          // 摘要
  coverImage: string,       // 封面图
  tags: string[],           // 标签
  category: string,         // 分类
  status: 'draft' | 'published',  // 状态
  viewCount: number,        // 浏览量
  author: ObjectId,         // 作者ID
  createdAt: Date,
  updatedAt: Date
}
```

### 6.3 项目集合 (projects)
```typescript
{
  _id: ObjectId,
  title: string,            // 项目名称
  description: string,      // 描述
  coverImage: string,       // 封面图
  images: string[],         // 图片列表
  techStack: string[],      // 技术栈
  demoUrl: string,          // 演示地址
  sourceUrl: string,        // 源码地址
  featured: boolean,        // 是否精选
  status: 'developing' | 'completed' | 'archived',
  createdAt: Date,
  updatedAt: Date
}
```

### 6.4 联系消息集合 (contacts)
```typescript
{
  _id: ObjectId,
  name: string,             // 发送者姓名
  email: string,           // 发送者邮箱
  subject: string,         // 主题
  message: string,         // 消息内容
  isRead: boolean,         // 是否已读
  createdAt: Date
}
```

## 七、API设计

### 7.1 认证相关
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `POST /api/auth/logout` - 登出
- `GET /api/auth/profile` - 获取当前用户信息
- `PUT /api/auth/profile` - 更新个人资料

### 7.2 博客相关
- `GET /api/blogs` - 获取博客列表(支持分页、筛选)
- `GET /api/blogs/:slug` - 获取博客详情
- `POST /api/blogs` - 创建博客(需认证)
- `PUT /api/blogs/:id` - 更新博客(需认证)
- `DELETE /api/blogs/:id` - 删除博客(需认证)

### 7.3 项目相关
- `GET /api/projects` - 获取项目列表
- `GET /api/projects/:id` - 获取项目详情
- `POST /api/projects` - 创建项目(需认证)
- `PUT /api/projects/:id` - 更新项目(需认证)
- `DELETE /api/projects/:id` - 删除项目(需认证)

### 7.4 联系相关
- `POST /api/contact` - 发送联系消息

### 7.5 公开信息
- `GET /api/public/profile` - 获取公开的个人资料

## 八、前端页面规划

### 8.1 公开页面
- **首页** (`/`) - 个人介绍、技能展示、精选项目
- **关于** (`/about`) - 详细个人信息、工作经历、教育背景
- **项目** (`/projects`) - 项目作品集
- **博客** (`/blog`) - 博客文章列表
- **博客详情** (`/blog/:slug`) - 文章阅读页面
- **联系** (`/contact`) - 联系表单

### 8.2 管理后台
- **登录** (`/admin/login`) - 管理员登录
- **仪表盘** (`/admin/dashboard`) - 数据概览
- **博客管理** (`/admin/blogs`) - 博客增删改查
- **项目管理** (`/admin/projects`) - 项目增删改查
- **消息管理** (`/admin/messages`) - 查看联系消息
- **设置** (`/admin/settings`) - 个人资料设置

## 九、开发阶段

### Phase 1: 基础搭建 (第1周)
- 项目初始化(前端+后端)
- 数据库连接配置
- 基础项目结构搭建
- 开发环境配置

### Phase 2: 后端核心功能 (第2-3周)
- 用户认证模块(JWT)
- CRUD接口开发
- API文档编写
- 文件上传功能

### Phase 3: 前端开发 (第4-5周)
- 公开页面开发
- 管理后台开发
- 响应式设计
- 动画效果实现

### Phase 4: 测试与优化 (第6周)
- 单元测试
- 集成测试
- 性能优化
- SEO优化

### Phase 5: 部署上线 (第7周)
- Docker容器化
- CI/CD配置
- 生产环境部署
- 域名与SSL配置

## 十、部署方案

### 10.1 开发环境
- 本地 MongoDB 实例或 MongoDB Docker 容器
- 前端开发服务器: http://localhost:5173
- 后端API服务器: http://localhost:3000

### 10.2 生产环境
- **前端**: Vercel / Netlify / 阿里云OSS静态托管
- **后端**: 阿里云ECS / 腾讯云CVM / Railway
- **数据库**: MongoDB Atlas / 阿里云MongoDB

### 10.3 Docker部署
```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/aboutme
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## 十一、技术亮点

1. **类型安全**: 前后端均使用TypeScript，保证代码质量
2. **现代UI**: 使用Tailwind CSS，响应式设计
3. **SEO友好**: 使用React Helmet，支持SSG/SSR扩展
4. **安全可靠**: JWT认证、密码加密、XSS防护
5. **高性能**: 代码分割、懒加载、CDN加速
6. **易于维护**: 模块化设计、清晰的代码结构
7. **API文档**: 自动生成Swagger文档

## 十二、扩展计划

- [ ] 评论系统
- [ ] 文章点赞/收藏
- [ ] 访问统计
- [ ] RSS订阅
- [ ] 暗黑模式
- [ ] 国际化(i18n)
- [ ] 搜索功能
- [ ] Markdown编辑器增强

---

**下一步**: 确认方案后，可以开始初始化项目结构并进行开发。