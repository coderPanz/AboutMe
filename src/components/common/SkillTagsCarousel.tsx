import { motion } from 'framer-motion'
import { SkillIcon, getSkillColor } from './SkillIcon'
import { useRef, useState } from 'react'

interface SkillTag {
  name: string
}

interface SkillTagsCarouselProps {
  skills: SkillTag[]
  speed?: number // 轮播速度（秒）
}

export function SkillTagsCarousel({ skills, speed = 30 }: SkillTagsCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  // 复制技能列表以实现无缝循环
  const duplicatedSkills = [...skills, ...skills, ...skills]

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-8"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 渐变遮罩 - 左侧 */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none" />
      {/* 渐变遮罩 - 右侧 */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-6"
        animate={{
          x: isPaused ? undefined : [0, -skills.length * 160],
        }}
        transition={{
          x: {
            duration: speed,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'loop',
          },
        }}
      >
        {duplicatedSkills.map((skill, index) => (
          <motion.div
            key={`${skill.name}-${index}`}
            whileHover={{ scale: 1.05, y: -4 }}
            className="group relative flex-shrink-0"
          >
            {/* 卡片背景发光效果 */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ backgroundColor: `${getSkillColor(skill.name)}20` }}
            />

            {/* 卡片主体 */}
            <div className="relative flex items-center gap-3 px-6 py-4 bg-[#111113] border border-white/[0.06] rounded-2xl transition-all duration-300 group-hover:bg-[#161618] group-hover:border-white/[0.1] min-w-[140px]">
              {/* 技能图标 */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${getSkillColor(skill.name)}15` }}
              >
                <SkillIcon name={skill.name} size={22} />
              </div>

              {/* 技能名称 */}
              <span className="text-white font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
