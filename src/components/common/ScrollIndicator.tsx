import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * 滚动指示器组件 - 带横线分割和流水粒子特效
 * 当用户往下滑动时粒子消失
 */
export default function ScrollIndicator() {
  const [isVisible, setIsVisible] = useState(true)
  const { scrollY } = useScroll()
  
  // 当滚动超过100px时隐藏指示器
  const opacity = useTransform(scrollY, [0, 100, 150], [1, 0.5, 0])
  const scale = useTransform(scrollY, [0, 100], [1, 0.8])

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest < 150)
    })
    return () => unsubscribe()
  }, [scrollY])

  // 生成粒子
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    delay: i * 0.15,
    duration: 1.2 + Math.random() * 0.4,
    x: (i % 2 === 0 ? -1 : 1) * (8 + Math.random() * 15),
  }))

  if (!isVisible) return null

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute bottom-16 left-0 right-0 flex flex-col items-center"
    >
      {/* 文字提示 - 放上面 */}
      <motion.span
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs font-medium tracking-widest uppercase text-[#9CA3AF] mb-4"
      >
        探索更多
      </motion.span>

      {/* 粒子流动容器 - 增大尺寸 */}
      <div className="relative w-10 h-20 overflow-visible mb-4">
        {/* 中心线 - 更粗更明显 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#10B981]/0 via-[#10B981]/50 to-[#10B981]/0 -translate-x-1/2" />
        
        {/* 流水粒子 - 更大更亮 */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_6px_rgba(16,185,129,0.6)]"
            initial={{ 
              y: -8, 
              x: particle.x,
              opacity: 0,
              scale: 0.3 
            }}
            animate={{ 
              y: [0, 70],
              opacity: [0, 1, 1, 0],
              scale: [0.3, 1, 1, 0.3],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeIn",
            }}
            style={{ translateX: '-50%' }}
          />
        ))}

        {/* 拖尾效果粒子 */}
        {particles.slice(0, 8).map((particle) => (
          <motion.div
            key={`trail-${particle.id}`}
            className="absolute left-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-[#10B981]/80 to-transparent"
            initial={{ 
              y: -8, 
              x: particle.x * 0.5,
              opacity: 0,
            }}
            animate={{ 
              y: [0, 70],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration * 0.8,
              delay: particle.delay + 0.2,
              repeat: Infinity,
              ease: "easeIn",
            }}
            style={{ translateX: '-50%' }}
          />
        ))}

        {/* 底部扩散波纹 - 更明显 */}
        <motion.div
          className="absolute bottom-0 left-1/2 w-6 h-1.5 rounded-full bg-[#10B981]/40"
          animate={{
            scale: [1, 2.5, 4],
            opacity: [0.6, 0.3, 0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          style={{ translateX: '-50%' }}
        />
      </div>

      {/* 底部箭头 */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="mb-6"
      >
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-[#10B981]">
          <path 
            d="M8 3V13M8 13L3 8M8 13L13 8" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>

      {/* 横线分割 - 放最下面 */}
      <div className="w-full max-w-md mx-auto relative">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#E5E7EB] to-transparent" />
        {/* 横线上的流动光点 */}
        <motion.div
          className="absolute top-0 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-[#10B981] to-transparent"
          animate={{
            x: [-100, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ translateX: '-50%' }}
        />
      </div>
    </motion.div>
  )
}
