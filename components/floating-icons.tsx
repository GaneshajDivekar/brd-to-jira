"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { FileText, GitPullRequest, Users, BarChart2, CheckSquare } from "lucide-react"

type FloatingIcon = {
  id: number
  icon: React.ReactNode
  x: number
  y: number
  size: number
  speed: number
  direction: number
  opacity: number
}

export default function FloatingIcons() {
  const [icons, setIcons] = useState<FloatingIcon[]>([])

  useEffect(() => {
    // Create initial icons
    const initialIcons: FloatingIcon[] = [
      {
        id: 1,
        icon: <FileText className="text-blue-500/30 dark:text-blue-400/20" />,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: 0.2 + Math.random() * 0.3,
      },
      {
        id: 2,
        icon: <GitPullRequest className="text-purple-500/30 dark:text-purple-400/20" />,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: 0.2 + Math.random() * 0.3,
      },
      {
        id: 3,
        icon: <Users className="text-green-500/30 dark:text-green-400/20" />,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: 0.2 + Math.random() * 0.3,
      },
      {
        id: 4,
        icon: <BarChart2 className="text-yellow-500/30 dark:text-yellow-400/20" />,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: 0.2 + Math.random() * 0.3,
      },
      {
        id: 5,
        icon: <CheckSquare className="text-red-500/30 dark:text-red-400/20" />,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 24 + Math.random() * 24,
        speed: 0.2 + Math.random() * 0.3,
        direction: Math.random() * 360 * (Math.PI / 180),
        opacity: 0.2 + Math.random() * 0.3,
      },
    ]

    setIcons(initialIcons)

    // Animation loop
    const interval = setInterval(() => {
      setIcons((prevIcons) =>
        prevIcons.map((icon) => {
          // Calculate new position
          let newX = icon.x + Math.cos(icon.direction) * icon.speed
          let newY = icon.y + Math.sin(icon.direction) * icon.speed
          let newDirection = icon.direction

          // Bounce off edges
          if (newX < 0 || newX > 100) {
            newDirection = Math.PI - newDirection
            newX = Math.max(0, Math.min(100, newX))
          }
          if (newY < 0 || newY > 100) {
            newDirection = -newDirection
            newY = Math.max(0, Math.min(100, newY))
          }

          return {
            ...icon,
            x: newX,
            y: newY,
            direction: newDirection,
          }
        }),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute transition-transform duration-[50ms] ease-linear"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            transform: `translate(-50%, -50%) scale(${icon.size / 24})`,
            opacity: icon.opacity,
          }}
        >
          {icon.icon}
        </div>
      ))}
    </div>
  )
}
