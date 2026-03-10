import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Search, Folder, FolderX } from 'lucide-react'
import projects from '@/data/projects.json'

type StatusFilter = 'all' | 'completed' | 'developing' | 'archived'

const statusButtons: { status: StatusFilter; label: string }[] = [
  { status: 'all', label: '全部' },
  { status: 'completed', label: '已完成' },
  { status: 'developing', label: '开发中' },
  { status: 'archived', label: '已归档' },
]

const statusConfig = {
  completed: { color: '#10B981', bgColor: '#ECFDF5', label: '已完成' },
  developing: { color: '#FBBF24', bgColor: '#FFFBEB', label: '开发中' },
  archived: { color: '#9CA3AF', bgColor: '#F9FAFB', label: '已归档' },
}

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
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="hero-tag mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>项目展示</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            项目作品
          </h1>
          <p className="text-[#9CA3AF]">
            我的开源作品与实践项目
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />
            <input
              type="text"
              placeholder="搜索项目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#F3F4F6] rounded-xl text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/10 transition-all"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {statusButtons.map(({ status, label }) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-[#10B981] text-white shadow-sm'
                    : 'bg-white text-[#4B5563] hover:text-[#1F2937] border border-[#F3F4F6] hover:border-[#E5E7EB]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

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
              {filteredProjects.map((project, index) => {
                const statusStyle = statusConfig[project.status as keyof typeof statusConfig]
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="group card-modern overflow-hidden"
                  >
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
                            <Folder size={20} className="text-[#10B981]" />
                          </div>
                          <h3 className="text-xl font-bold text-[#1F2937] group-hover:text-[#10B981] transition-colors">
                            {project.title}
                          </h3>
                        </div>
                        <span
                          className="px-3 py-1 text-xs font-medium rounded-full"
                          style={{ 
                            backgroundColor: statusStyle.bgColor, 
                            color: statusStyle.color 
                          }}
                        >
                          {statusStyle.label}
                        </span>
                      </div>

                      <p className="text-[#4B5563] text-sm leading-relaxed mb-5 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack - 循环使用三色 */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.techStack.map((tech, idx) => (
                          <span
                            key={tech}
                            className={`text-xs ${
                              idx % 3 === 0 ? 'tag-primary' : 
                              idx % 3 === 1 ? 'tag-secondary' : 
                              'tag-accent'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-4 pt-4 border-t border-[#F3F4F6]">
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm font-medium text-[#3B82F6] hover:text-[#10B981] transition-colors"
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
                            className="flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
                          >
                            <Github size={16} />
                            源码
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card-modern p-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#F9FAFB] flex items-center justify-center mx-auto mb-6">
                <FolderX size={32} className="text-[#9CA3AF]" />
              </div>
              <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                未找到匹配项目
              </h3>
              <p className="text-[#9CA3AF]">
                尝试调整搜索关键词或筛选条件
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
