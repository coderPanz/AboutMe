import { motion } from 'framer-motion'

interface Skill {
  name: string
  level: number
  category: string
}

interface SkillRadarProps {
  skills: Skill[]
  size?: number
}

/**
 * 技能雷达图组件
 * 直观展示技术栈和优势
 */
export default function SkillRadar({ skills, size = 280 }: SkillRadarProps) {
  // 选择前6个技能展示
  const displaySkills = skills.slice(0, 6)
  const center = size / 2
  const radius = size * 0.35
  const angleStep = (2 * Math.PI) / displaySkills.length

  // 计算多边形顶点
  const getPoint = (index: number, level: number) => {
    const angle = index * angleStep - Math.PI / 2
    const r = (level / 100) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    }
  }

  // 生成多边形路径
  const polygonPoints = displaySkills
    .map((skill, i) => {
      const point = getPoint(i, skill.level)
      return `${point.x},${point.y}`
    })
    .join(' ')

  // 生成背景网格路径
  const gridLevels = [20, 40, 60, 80, 100]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-0">
        {/* 背景同心多边形 */}
        {gridLevels.map((level, idx) => {
          const points = displaySkills
            .map((_, i) => {
              const point = getPoint(i, level)
              return `${point.x},${point.y}`
            })
            .join(' ')
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="1"
              opacity={0.5 + idx * 0.1}
            />
          )
        })}

        {/* 轴线 */}
        {displaySkills.map((_, i) => {
          const end = getPoint(i, 100)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          )
        })}

        {/* 数据多边形 */}
        <motion.polygon
          points={polygonPoints}
          fill="rgba(16, 185, 129, 0.2)"
          stroke="#10B981"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* 数据点 */}
        {displaySkills.map((skill, i) => {
          const point = getPoint(i, skill.level)
          return (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#10B981"
              stroke="white"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
            />
          )
        })}
      </svg>

      {/* 技能标签 */}
      {displaySkills.map((skill, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = radius + 30
        const x = center + labelRadius * Math.cos(angle)
        const y = center + labelRadius * Math.sin(angle)
        
        return (
          <motion.div
            key={skill.name}
            className="absolute text-xs font-medium text-[#4B5563] bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-[#F3F4F6] shadow-sm"
            style={{
              left: x,
              top: y,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            {skill.name}
            <span className="ml-1 text-[#10B981]">{skill.level}%</span>
          </motion.div>
        )
      })}
    </div>
  )
}
