import { useEffect, useRef } from 'react'

interface GridBackgroundProps {
  className?: string
}

export default function GridBackground({ className = '' }: GridBackgroundProps) {
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

    // Grid configuration
    const gridSize = 60
    const gridColor = 'rgba(255, 255, 255, 0.03)'

    let animationId: number
    let offset = 0

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw vertical lines
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 1

      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw horizontal lines with subtle animation
      for (let y = offset % gridSize; y <= canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw perspective lines from center
      const centerX = canvas.width / 2
      const perspectiveColor = 'rgba(99, 102, 241, 0.05)'

      ctx.strokeStyle = perspectiveColor
      for (let i = -20; i <= 20; i++) {
        ctx.beginPath()
        ctx.moveTo(centerX + i * gridSize, canvas.height)
        ctx.lineTo(centerX + i * gridSize * 2, 0)
        ctx.stroke()
      }

      // Slowly move the grid
      offset += 0.2
      animationId = requestAnimationFrame(drawGrid)
    }

    drawGrid()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}