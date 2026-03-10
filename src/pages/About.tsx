import { motion } from 'framer-motion'
import { Briefcase, Code } from 'lucide-react'
import profile from '@/data/profile.json'
import experience from '@/data/experience.json'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="hero-tag mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>关于我</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1F2937] mb-4">
            个人简介
          </h1>
          <p className="text-[#9CA3AF]">
            了解更多关于我的故事
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="card-modern p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#3B82F6] flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {profile.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1F2937] mb-2">
                  {profile.name}
                </h2>
                <p className="text-[#10B981] font-medium mb-4">{profile.title}</p>
                <p className="text-[#4B5563] leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Work Experience */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-[#1F2937] mb-8 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
              <Briefcase size={20} className="text-[#10B981]" />
            </div>
            工作经历
          </motion.h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#F3F4F6]" />

            <div className="space-y-6">
              {experience.work.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-14"
                >
                  {/* Timeline dot - 使用辅助色 */}
                  <div className="absolute left-3 top-4 w-4 h-4 rounded-full bg-[#3B82F6] border-4 border-white shadow-sm" />

                  <div className="card-modern p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1F2937] mb-1">
                          {work.position}
                        </h3>
                        <p className="text-[#3B82F6] font-medium">{work.company}</p>
                      </div>
                      <span className="text-sm text-[#9CA3AF] mt-2 sm:mt-0 bg-[#F9FAFB] px-3 py-1 rounded-full">
                        {work.period}
                      </span>
                    </div>
                    <p className="text-[#4B5563] leading-relaxed mb-4">
                      {work.description}
                    </p>
                    {work.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {work.technologies.map((tech, idx) => (
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
            className="text-2xl font-bold text-[#1F2937] mb-8 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
              <Code size={20} className="text-[#3B82F6]" />
            </div>
            技能列表
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-modern p-8"
          >
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, index) => (
                <motion.span
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`${
                    index % 3 === 0 ? 'tag-primary' : 
                    index % 3 === 1 ? 'tag-secondary' : 
                    'tag-accent'
                  } cursor-default hover:scale-105 transition-transform`}
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
