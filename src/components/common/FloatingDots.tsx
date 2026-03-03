import { useEffect, useRef } from 'react'

interface Dot {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface FloatingDotsProps {
  count?: number
  className?: string
}

export default function FloatingDots({ count = 50, className = '' }: FloatingDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize dots
    const dots: Dot[] = []
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    let animationId: number

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      dots.forEach((dot) => {
        // Update position
        dot.x += dot.speedX
        dot.y += dot.speedY

        // Wrap around edges
        if (dot.x < 0) dot.x = canvas.width
        if (dot.x > canvas.width) dot.x = 0
        if (dot.y < 0) dot.y = canvas.height
        if (dot.y > canvas.height) dot.y = 0

        // Draw dot
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, dot.size * 3
        )
        gradient.addColorStop(0, `rgba(99, 102, 241, ${dot.opacity})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${dot.opacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')

        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Draw connections between nearby dots
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.05)'
      ctx.lineWidth = 1

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x
          const dy = dots[i].y - dots[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(dots[i].x, dots[i].y)
            ctx.lineTo(dots[j].x, dots[j].y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(drawDots)
    }

    drawDots()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [count])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
    />
  )
}