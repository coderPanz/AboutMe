import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Search, Folder } from 'lucide-react'
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
    <div className="bg-[#0c0c0c] min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="editorial-display text-5xl md:text-6xl text-white mb-4">
            项目作品
          </h1>
          <p className="font-mono text-sm text-[#737373]">
            <span className="text-[#22c55e]">$</span> find . -type f -name "*.project"
          </p>
        </motion.div>

        {/* Filters - Terminal style */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#525252]"
            />
            <input
              type="text"
              placeholder="grep project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white placeholder-[#525252] font-mono text-sm focus:outline-none focus:border-[#22c55e] transition-colors"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {statusButtons.map(({ status, label }) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2.5 rounded text-sm font-mono transition-colors ${
                  statusFilter === status
                    ? 'bg-[#22c55e] text-[#0c0c0c]'
                    : 'bg-[#1a1a1a] text-[#737373] hover:text-white border border-[#2a2a2a]'
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
              className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#1a1a1a] border border-[#1a1a1a]"
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group bg-[#0c0c0c] hover:bg-[#111111] transition-colors"
                >
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Folder size={20} className="text-[#525252]" />
                        <h3 className="text-xl font-semibold text-white group-hover:text-[#22c55e] transition-colors">
                          {project.title}
                        </h3>
                      </div>
                      <span
                        className={`px-2.5 py-1 text-xs rounded font-mono ${
                          project.status === 'completed'
                            ? 'bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20'
                            : project.status === 'developing'
                            ? 'bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20'
                            : 'bg-[#525252]/10 text-[#525252] border border-[#525252]/20'
                        }`}
                      >
                        {project.status === 'completed'
                          ? '● completed'
                          : project.status === 'developing'
                          ? '◐ developing'
                          : '○ archived'}
                      </span>
                    </div>

                    <p className="text-[#737373] text-sm leading-relaxed mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-[#1a1a1a] text-[#737373] text-xs font-mono border border-[#222222]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 font-mono text-sm">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#22c55e] hover:text-[#4ade80] transition-colors"
                        >
                          <ExternalLink size={14} />
                          demo
                        </a>
                      )}
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#737373] hover:text-white transition-colors"
                        >
                          <Github size={14} />
                          source
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
              className="text-center py-20 border border-[#1a1a1a] bg-[#0c0c0c]"
            >
              <p className="font-mono text-[#525252]">
                <span className="text-[#ff5f56]">error</span>: no matching projects found
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}