# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Build for production (tsc && vite build)
npm run preview    # Preview production build
npm test           # Run Vitest tests (watch mode)
npm run test:run   # Run tests once
```

## Tech Stack

- **Frontend**: React 19 + Vite 7 + TypeScript + Tailwind CSS 4
- **Routing**: React Router v7
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: react-markdown with remark/rehype plugins
- **Testing**: Vitest + Testing Library
- **Deployment**: Vercel (Serverless Functions + Cron)

## Architecture

### Frontend Structure
- `src/main.tsx` - Entry point with BrowserRouter
- `src/App.tsx` - Root component with route definitions
- `src/components/layout/` - Layout components (Header, Footer, Layout wrapper)
- `src/components/common/` - Reusable UI components
- `src/pages/` - Page components mapped to routes
- `src/content/blog/` - Markdown blog posts (glob-imported via Vite)
- `src/utils/markdown.ts` - Frontmatter parser and blog utilities
- `src/data/blog.ts` - Blog data layer with filtering/sorting functions

### Routing
- `/` - Home
- `/about` - About page
- `/projects` - Projects showcase
- `/blog` - Blog list
- `/blog/:slug` - Blog post detail (supports nested categories)
- `/blog/category/:category` - Category filter
- `/daily` - Daily report page
- `/contact` - Contact form

### Serverless Functions (Vercel)
- `api/daily-report.ts` - Generates AI-powered daily news report (DashScope/Qwen API + Vercel KV caching)
- `api/cron/refresh.ts` - Protected cron endpoint (daily 00:00 UTC) to pre-generate reports

### Key Patterns
- **Blog system**: Markdown files imported via `import.meta.glob` with raw loader
- **Type-safe**: Shared TypeScript interfaces in `src/types/index.ts`
- **Path alias**: `@/*` resolves to `./src/*`
- **KV caching**: Vercel KV for server-side caching with in-memory fallback
