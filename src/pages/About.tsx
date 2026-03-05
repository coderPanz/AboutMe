import { motion } from 'framer-motion'
import profile from '@/data/profile.json'
import experience from '@/data/experience.json'

export default function About() {
  return (
    <div className="bg-[#030305] min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">
            关于我
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl">
            了解更多关于我的背景、经历和技能
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card-glow rounded-2xl p-8 mb-16"
        >
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar placeholder */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#5b8ff5] to-[#3b82f6] rounded-full" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#5b8ff5] to-[#3b82f6] rounded-full blur-xl opacity-40" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {profile.name}
              </h2>
              <p className="text-[#5b8ff5] font-medium mb-4">{profile.title}</p>
              <p className="text-zinc-400 leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        </motion.div>

        {/* Work Experience */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-white mb-8"
          >
            工作经历
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#5b8ff5]/50 via-[#3b82f6]/30 to-transparent" />

            <div className="space-y-8">
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
                  <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-[#5b8ff5] border-4 border-[#030305]" />

                  <div className="card-glow rounded-xl p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {work.position}
                        </h3>
                        <p className="text-[#5b8ff5]">{work.company}</p>
                      </div>
                      <span className="text-sm text-zinc-500 mt-2 sm:mt-0 font-mono">
                        {work.period}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                      {work.description}
                    </p>
                    {work.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {work.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 bg-[#5b8ff5]/10 text-[#5b8ff5] text-xs rounded-md font-medium border border-[#5b8ff5]/20"
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

        {/* Skills */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-semibold text-white mb-8"
          >
            技能列表
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-glow rounded-xl p-6"
          >
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="px-4 py-2 bg-white/[0.04] text-zinc-300 rounded-lg text-sm border border-white/[0.06] hover:border-[#5b8ff5]/30 hover:text-white transition-colors cursor-default"
                >
                  {skill.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
