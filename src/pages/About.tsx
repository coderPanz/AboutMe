import { motion } from 'framer-motion'
import { User, Briefcase, Code } from 'lucide-react'
import profile from '@/data/profile.json'
import experience from '@/data/experience.json'

export default function About() {
  return (
    <div className="bg-[#0c0c0c] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="editorial-display text-5xl md:text-6xl text-white mb-4">
            关于我
          </h1>
        </motion.div>

        {/* Profile Card - Terminal style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a]">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#222222]">
              <User size={14} className="text-[#525252]" />
              <span className="font-mono text-xs text-[#737373]">profile</span>
            </div>
            <div className="p-6 bg-[#0c0c0c]">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar placeholder - Terminal style */}
                <div className="w-20 h-20 bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center font-mono text-3xl text-[#22c55e]">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-white mb-2">
                    {profile.name}
                  </h2>
                  <p className="text-[#22c55e] font-mono text-sm mb-4">{profile.title}</p>
                  <p className="text-[#a3a3a3] leading-relaxed font-mono text-sm">
                    // {profile.bio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work Experience - Terminal style */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-white mb-8 flex items-center gap-3"
          >
            <Briefcase size={24} className="text-[#525252]" />
            工作经历
          </motion.h2>

          <div className="relative">
            {/* Timeline line - Terminal style */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a1a1a]" />

            <div className="space-y-6">
              {experience.work.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-8"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[-5px] top-3 w-2.5 h-2.5 rounded-full bg-[#22c55e]" />

                  <div className="bg-[#1a1a1a] border border-[#222222] p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {work.position}
                        </h3>
                        <p className="text-[#22c55e] font-mono text-sm">{work.company}</p>
                      </div>
                      <span className="text-xs text-[#525252] mt-2 sm:mt-0 font-mono">
                        {work.period}
                      </span>
                    </div>
                    <p className="text-[#737373] text-sm leading-relaxed mb-4">
                      {work.description}
                    </p>
                    {work.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {work.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-[#0c0c0c] text-[#737373] text-xs font-mono border border-[#222222]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills - Terminal style */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-white mb-8 flex items-center gap-3"
          >
            <Code size={24} className="text-[#525252]" />
            技能列表
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="terminal-window rounded-lg overflow-hidden border border-[#2a2a2a]"
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#222222]">
              <span className="font-mono text-xs text-[#737373]">npm list --depth=0</span>
            </div>
            <div className="p-6 bg-[#0c0c0c]">
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <motion.span
                    key={skill.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="px-4 py-2 bg-[#1a1a1a] text-[#a3a3a3] text-sm font-mono border border-[#222222] hover:border-[#22c55e] hover:text-[#22c55e] transition-colors cursor-default"
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}