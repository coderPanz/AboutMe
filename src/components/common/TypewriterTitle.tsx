import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TypewriterTitleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

/**
 * 打字机动画标题组件
 * 主标题动态打字效果，搭配光标闪烁
 */
export default function TypewriterTitle({ 
  text, 
  className = '', 
  delay = 0,
  speed = 150 
}: TypewriterTitleProps) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [delay])

  useEffect(() => {
    if (!isTyping) return

    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1))
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [displayText, isTyping, speed, text])

  // 光标闪烁动画
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  return (
    <span className={`relative ${className}`}>
      {displayText}
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="inline-block w-[3px] h-[1em] bg-[#10B981] ml-1 align-middle"
      />
    </span>
  )
}
