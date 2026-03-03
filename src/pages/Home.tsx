import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import profile from '@/data/profile.json'
import projects from '@/data/projects.json'
import { blogPosts } from '@/data/blog'
import { SkillTagsCarousel } from '@/components/common/SkillTagsCarousel'

const featuredProjects = projects.filter((p) => p.featured).slice(0, 3)
const featuredBlogs = blogPosts.slice(0, 3)

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
} as const

export default function Home() {
  return (
    <div className="bg-[#030305]">
      {/* Hero Section - Immersive full screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Main gradient orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.15, 0.2, 0.15],
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#5b8ff5] blur-[120px]"
          />
          {/* Secondary orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.15, 0.1],
              scale: [1, 1.05, 1],
              x: [0, -20, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#7c6af5] blur-[100px]"
          />
          {/* Tertiary orb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.05, 0.08, 0.05] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#5b8ff5] to-[#7c6af5] blur-[80px]"
          />
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Welcome tag */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * 0, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm"
            >
              <Sparkles size={14} className="text-[#5b8ff5]" />
              <span className="text-sm text-zinc-400">欢迎来到我的世界</span>
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-white"
            >
              我是
              <span className="block mt-2 gradient-text">
                {profile.name}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * 2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-2xl sm:text-3xl md:text-4xl text-zinc-300 font-medium"
            >
              {profile.title}
            </motion.p>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * 3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              {profile.bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * 4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/projects"
                className="group btn-primary inline-flex items-center gap-2"
              >
                探索项目
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center"
              >
                与我联系
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-zinc-500"
          >
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-zinc-500 to-transparent" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Blogs Section */}
      <section className="section-padding bg-[#030305] relative">
        {/* Gradient accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-[#7c6af5]/[0.03] blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                  精选博客
                </h2>
                <p className="text-lg text-zinc-400">
                  技术心得与开发经验分享
                </p>
              </div>
              <Link
                to="/blog"
                className="group inline-flex items-center text-[#5b8ff5] hover:text-[#7c6af5] font-medium transition-colors"
              >
                查看全部
                <ArrowRight
                  size={18}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBlogs.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group block p-6 rounded-2xl border border-white/[0.06] bg-[#0a0a0c] hover:bg-[#111113] hover:border-white/[0.1] transition-all duration-300 h-full"
                  >
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {post.readTime} 分钟
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-[#5b8ff5] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs text-[#5b8ff5] bg-[#5b8ff5]/10 rounded-md font-medium border border-[#5b8ff5]/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="section-padding bg-[#0a0a0c] relative">
        {/* Gradient accent */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -right-[20%] w-[800px] h-[800px] rounded-full bg-[#5b8ff5]/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                  精选项目
                </h2>
                <p className="text-lg text-zinc-400">
                  我最引以为豪的作品
                </p>
              </div>
              <Link
                to="/projects"
                className="group inline-flex items-center text-[#5b8ff5] hover:text-[#7c6af5] font-medium transition-colors"
              >
                查看全部
                <ArrowRight
                  size={18}
                  className="ml-1 group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl overflow-hidden card-glow"
                >
                  {/* Project image area with gradient */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#5b8ff5] via-[#7c6af5] to-[#a855f7] relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/20 text-7xl font-bold">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#5b8ff5] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white/[0.04] text-zinc-400 text-xs rounded-full font-medium border border-white/[0.06]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Tags Section - Moved to bottom with carousel */}
      <section className="section-padding bg-[#030305] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full bg-[#5b8ff5]/[0.02] blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
              技术标签
            </h2>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto">
              多年积累的技术栈，持续学习与探索
            </p>
          </motion.div>

          <SkillTagsCarousel skills={profile.skills} />
        </div>
      </section>
    </div>
  )
}
