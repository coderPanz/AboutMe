import { motion } from "framer-motion"
import { ArrowRight, Star, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import profile from "@/data/profile.json"
import projects from "@/data/projects.json"
import { blogPosts } from "@/data/blog"

const featuredProjects = projects.filter(p => p.featured).slice(0, 3)
const featuredBlogs = blogPosts.slice(0, 3)

// Animation variants - slower, more elegant
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
} as const

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
} as const

export default function Home() {
  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      {/* Hero Section - Editorial + Terminal */}
      <section className="relative min-h-screen flex items-center">
        {/* Subtle grid - terminal aesthetic */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 222, 128, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 222, 128, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="max-w-6xl mx-auto px-6 py-32 relative z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Terminal-style meta info - Editorial placement */}
            <motion.div variants={fadeUp} className="mb-16">
              <div className="flex items-center gap-4 text-sm font-mono">
                <span className="text-[#737373]">~/portfolio</span>
                <span className="text-[#525252]">git:main</span>
                <span className="text-[#22c55e]">●</span>
              </div>
            </motion.div>

            {/* Editorial large title with terminal accent */}
            <motion.div variants={fadeUp} className="mb-12">
              <h1 className="editorial-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.95]">
                <span>I'm </span>
                <span className="gradient-text">{profile.name}</span>
              </h1>
            </motion.div>

            {/* Terminal-style title window (skills --list style) */}
            <motion.div variants={fadeUp} className="mb-8 max-w-4xl">
              <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a]">
                {/* Window header */}
                <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#222222]">
                  <div className="flex items-center gap-2">
                    <div className="terminal-dot terminal-dot--red" />
                    <div className="terminal-dot terminal-dot--yellow" />
                    <div className="terminal-dot terminal-dot--green" />
                    <span className="ml-4 font-mono text-sm text-[#737373]">whoami --title</span>
                  </div>
                  <span className="font-mono text-sm text-[#525252]">ready</span>
                </div>
                {/* Content */}
                <div className="p-6 md:p-8 bg-[#0c0c0c]">
                  <h2 className="font-mono text-xl md:text-2xl text-white mb-2">
                    <span className="text-[#fbbf24]">&gt;</span>
                    <span className="text-[#a3a3a3]"> whoami </span>
                    <span className="text-white">{profile.title}</span>
                  </h2>
                  <p className="font-mono text-sm text-[#525252] mb-6">
                    // {profile.bio}
                  </p>
                  <div className="font-mono text-sm flex flex-wrap items-center gap-x-3 gap-y-2 mb-4 pt-4 border-t border-[#1a1a1a]">
                    <span className="text-[#22c55e]">$</span>
                    <span className="text-white">skills:</span>
                    <span className="text-[#fbbf24]">{profile.skills.length}</span>
                    <span className="text-[#737373]">--list</span>
                    <span className="flex items-center gap-1.5 ml-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2a2a2a] text-white font-mono text-xs border border-[#333]">
                        <Star size={12} className="fill-white" />
                        frontend
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1a1a1a] text-[#737373] font-mono text-xs border border-[#222]">
                        <Clock size={12} />
                        tools
                      </span>
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#525252]">
                    <span className="text-[#22c55e]">→</span> 向下滚动查看技能列表与项目
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Bio - Editorial style, clean and spacious */}
            <motion.p
              variants={fadeUp}
              className="text-xl md:text-2xl text-[#a3a3a3] max-w-3xl leading-relaxed mb-16 font-light"
            >
              {profile.bio}
            </motion.p>

            {/* CTA - Terminal command style */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-6">
              <Link
                to="/projects"
                className="btn-primary inline-flex items-center gap-3 group"
              >
                <span className="text-[#0c0c0c]">~/explore-projects</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform text-[#0c0c0c]"
                />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 font-mono"
              >
                <span className="text-[#22c55e]">$</span>
                <span>contact</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator - minimal terminal style */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-3 text-[#525252]">
            <span className="font-mono text-xs tracking-widest">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#525252] to-transparent" />
          </div>
        </motion.div>
      </section>

      {/* Featured Blogs - Terminal window style */}
      <section className="py-24 md:py-32 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header - Terminal style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h2 className="editorial-display text-4xl md:text-5xl text-white">精选博客</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a1a1a] border border-[#1a1a1a]">
            {featuredBlogs.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="group block p-8 bg-[#0c0c0c] hover:bg-[#111111] transition-colors h-full"
                >
                  {/* Meta - terminal comment style */}
                  <div className="font-mono text-xs text-[#525252] mb-4">
                    <span className="text-[#22c55e]">//</span> {post.date} · {post.readTime} min read
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-[#22c55e] transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-[#737373] text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags - terminal style */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="font-mono text-xs px-2 py-1 bg-[#1a1a1a] text-[#a3a3a3] border border-[#222222]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* View all link - terminal style */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-mono text-[#22c55e] hover:text-[#4ade80] transition-colors"
            >
              <span>$</span>
              <span>ls -la ./blog</span>
              <ArrowRight size={16} className="group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects - Editorial card style */}
      <section className="py-24 md:py-32 border-t border-[#1a1a1a] bg-[#0c0c0c]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header - Editorial style */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="mb-8">
              <h2 className="editorial-display text-4xl md:text-5xl text-white">精选项目</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group card-glow"
              >
                {/* Project header - terminal style */}
                <div className="px-6 py-4 bg-[#1a1a1a] border-b border-[#222222] flex items-center justify-between">
                  <span className="font-mono text-sm text-[#737373]">
                    {index + 1}.
                  </span>
                  <span className="font-mono text-xs text-[#22c55e]">● active</span>
                </div>

                {/* Project content */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-[#22c55e] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-[#a3a3a3] text-sm leading-relaxed mb-6">
                    {project.description}
                  </p>

                  {/* Tech stack - terminal package style */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 4).map(tech => (
                      <span
                        key={tech}
                        className="font-mono text-xs px-2 py-1.5 bg-[#111111] text-[#737373] border border-[#1a1a1a]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Project footer */}
                <div className="px-6 py-4 border-t border-[#1a1a1a]">
                  <span className="font-mono text-xs text-[#525252] group-hover:text-[#22c55e] transition-colors flex items-center gap-2">
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    view-project
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View all link */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 text-center"
          >
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-mono text-[#22c55e] hover:text-[#4ade80] transition-colors"
            >
              <span>$</span>
              <span>ls ./projects</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Skills section - Terminal package list style */}
      <section className="py-24 md:py-32 border-t border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
          </motion.div>
          {/* Skills grid - npm package style */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-[#1a1a1a] border border-[#1a1a1a]"
          >
            {profile.skills.slice(0, 18).map((skill) => (
              <div
                key={skill.name}
                className="p-4 bg-[#0c0c0c] font-mono text-sm text-[#737373] hover:bg-[#111111] hover:text-[#22c55e] transition-colors cursor-default"
              >
                <span className="text-[#22c55e]">├─</span> {skill.name}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}