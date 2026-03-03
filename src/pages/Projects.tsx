import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Search } from 'lucide-react'
import projects from '@/data/projects.json'

type StatusFilter = 'all' | 'completed' | 'developing' | 'archived'

const statusButtons: { status: StatusFilter; label: string }[] = [
  { status: 'all', label: '全部' },
  { status: 'completed', label: '已完成' },
  { status: 'developing', label: '开发中' },
  { status: 'archived', label: '已归档' },
]

export default function Projects() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )
    return matchesStatus && matchesSearch
  })

  return (
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
            项目作品
          </h1>
          <p className="text-lg text-zinc-400">
            探索我创作的作品
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#111113] border border-white/[0.06] rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#5b8ff5]/30 focus:border-[#5b8ff5]/30 transition-all"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {statusButtons.map(({ status, label }) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  statusFilter === status
                    ? 'bg-gradient-to-r from-[#5b8ff5] to-[#7c6af5] text-white shadow-lg shadow-[#5b8ff5]/25'
                    : 'bg-[#111113] text-zinc-400 hover:text-white hover:bg-[#161618] border border-white/[0.06]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="group relative rounded-2xl overflow-hidden card-glow"
                >
                  {/* Project image */}
                  <div className="aspect-video bg-gradient-to-br from-[#5b8ff5] via-[#7c6af5] to-[#a855f7] relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white/15 text-7xl font-bold group-hover:scale-110 transition-transform duration-500">
                        {project.title.charAt(0)}
                      </span>
                    </div>
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white group-hover:text-[#5b8ff5] transition-colors">
                        {project.title}
                      </h3>
                      <span
                        className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                          project.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : project.status === 'developing'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                        }`}
                      >
                        {project.status === 'completed'
                          ? '已完成'
                          : project.status === 'developing'
                          ? '开发中'
                          : '已归档'}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white/[0.04] text-zinc-400 text-xs rounded-full font-medium border border-white/[0.06]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#5b8ff5] hover:text-[#7c6af5] text-sm font-medium transition-colors"
                        >
                          <ExternalLink size={16} />
                          演示
                        </a>
                      )}
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                        >
                          <Github size={16} />
                          源码
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-zinc-500">没有找到匹配的项目</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
