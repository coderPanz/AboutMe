import { motion } from "framer-motion"
import { 
  ArrowRight, 
  Star, 
  Clock, 
  Code2, 
  Briefcase,
  Calendar,
  ExternalLink,
  Github,
  Zap
} from "lucide-react"
import { Link } from "react-router-dom"
import profile from "@/data/profile.json"
import projects from "@/data/projects.json"
import { blogPosts } from "@/data/blog"
import TypewriterTitle from "@/components/common/TypewriterTitle"
import SkillRadar from "@/components/common/SkillRadar"
import SubscribeCTA from "@/components/common/SubscribeCTA"
import BackgroundTexture from "@/components/common/BackgroundTexture"
import ScrollIndicator from "@/components/common/ScrollIndicator"

const featuredProjects = projects.filter(p => p.featured).slice(0, 3)
const featuredBlogs = blogPosts.slice(0, 3)

// 动画变体
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const }
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  },
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] relative">
      {/* 背景纹理 */}
      <BackgroundTexture />
      
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-start justify-center pt-24 lg:pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* 左侧内容 */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              {/* 标签 */}
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#ECFDF5] text-[#059669] text-sm font-medium rounded-full border border-[#10B981]/20">
                  <Zap size={14} className="text-[#10B981]" />
                  半吊子AI + 前端开发工程师
                </span>
              </motion.div>

              {/* 主标题 - 打字机效果 */}
              <motion.div variants={fadeUp} className="mb-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F2937] leading-tight tracking-tight">
                  <TypewriterTitle text="北漂螺丝钉" delay={300} speed={120} />
                </h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-4 text-lg text-[#6B7280] font-light tracking-wide"
                >
                  人不一定往上走，也可以四处走走
                </motion.p>
              </motion.div>

              {/* 关于我卡片 - 补充具体经历 */}
              <motion.div variants={fadeUp} className="mb-8">
                <div className="bg-white/80 backdrop-blur rounded-2xl border border-[#E5E7EB] p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center flex-shrink-0">
                      <Star size={24} className="text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[#1F2937] leading-relaxed mb-3">
                        {profile.bio}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={14} className="text-[#3B82F6]" />
                          5年+ 开发经验
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Code2 size={14} className="text-[#10B981]" />
                          React / Vue / AI
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Github size={14} className="text-[#6B7280]" />
                          10+ 开源项目
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CTA 按钮 */}
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Link to="/projects">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-6 py-3.5 bg-[#10B981] text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-[#10B981]/20 hover:shadow-xl hover:shadow-[#10B981]/30 transition-all"
                  >
                    <span>查看项目</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/blog">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-6 py-3.5 bg-white text-[#1F2937] font-semibold rounded-xl border border-[#E5E7EB] flex items-center gap-2 hover:border-[#10B981] hover:text-[#10B981] hover:bg-[#ECFDF5] transition-all"
                  >
                    <span>阅读博客</span>
                    <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* 右侧 - 技能雷达图 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:flex items-center justify-center"
            >
              <SkillRadar skills={profile.skills} size={400} />
            </motion.div>
          </div>
        </div>

        {/* 向下滚动指示 - 带横线分割和流水粒子特效 */}
        <ScrollIndicator />
      </section>

      {/* 最新博客 Section */}
      <section className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-2">最新博客</h2>
              <p className="text-[#6B7280]">技术心得与学习笔记</p>
            </div>
            <Link to="/blog" className="hidden sm:flex items-center gap-1 text-[#3B82F6] font-medium hover:gap-2 transition-all">
              查看全部 <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:shadow-lg hover:shadow-[#10B981]/5 hover:border-[#10B981]/30 transition-all h-full flex flex-col"
                  >
                    {/* 缩略图占位 */}
                    <div className="h-40 bg-gradient-to-br from-[#ECFDF5] to-[#EFF6FF] flex items-center justify-center">
                      <span className="text-4xl font-bold text-[#10B981]/30">{post.title?.charAt(0) || '?'}</span>
                    </div>
                    
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime} min
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#1F2937] mb-2 group-hover:text-[#10B981] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-sm text-[#6B7280] line-clamp-2 mb-4 flex-1">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {(post.tags || []).slice(0, 2).map((tag, idx) => (
                          <span 
                            key={tag} 
                            className={`text-xs px-2.5 py-1 rounded-full ${
                              idx === 0 ? 'bg-[#ECFDF5] text-[#059669]' : 
                              'bg-[#EFF6FF] text-[#2563EB]'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 精选项目 Section */}
      <section className="py-20 px-4 sm:px-6 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-[#1F2937] mb-2">精选项目</h2>
              <p className="text-[#6B7280]">开源作品与实践项目</p>
            </div>
            <Link to="/projects" className="hidden sm:flex items-center gap-1 text-[#3B82F6] font-medium hover:gap-2 transition-all">
              查看全部 <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div
                  whileHover={{ y: -5 }}
                  className="group bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6 hover:shadow-lg hover:shadow-[#10B981]/5 hover:border-[#10B981]/30 transition-all h-full flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                      <span className="text-xl font-bold text-[#10B981]">{project.title?.charAt(0) || '?'}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      project.status === 'completed' ? 'bg-[#ECFDF5] text-[#059669]' : 
                      'bg-[#FFFBEB] text-[#D97706]'
                    }`}>
                      {project.status === 'completed' ? '已完成' : '开发中'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-[#1F2937] mb-2 group-hover:text-[#10B981] transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-[#6B7280] line-clamp-2 mb-4 flex-1">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, idx) => (
                      <span 
                        key={tech} 
                        className={`text-xs px-2.5 py-1 rounded-full ${
                          idx === 0 ? 'bg-white border border-[#E5E7EB] text-[#4B5563]' : 
                          idx === 1 ? 'bg-[#ECFDF5] text-[#059669]' :
                          'bg-[#EFF6FF] text-[#2563EB]'
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-[#E5E7EB]">
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#3B82F6] hover:text-[#10B981] flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={14} />
                        演示
                      </a>
                    )}
                    {project.sourceUrl && (
                      <a 
                        href={project.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#6B7280] hover:text-[#1F2937] flex items-center gap-1 transition-colors"
                      >
                        <Github size={14} />
                        源码
                      </a>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 订阅 CTA */}
      <SubscribeCTA />
    </div>
  )
}
