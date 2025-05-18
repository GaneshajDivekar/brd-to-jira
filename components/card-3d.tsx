"use client"

import type React from "react"

import { useState, useRef, type ReactNode, useEffect } from "react"
import { motion } from "framer-motion"

interface Card3DProps {
  children: ReactNode
  className?: string
  intensity?: number
  border?: boolean
  shadow?: boolean
  glare?: boolean
  scale?: boolean
}

export default function Card3D({
  children,
  className = "",
  intensity = 10,
  border = true,
  shadow = true,
  glare = true,
  scale = true,
}: Card3DProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Clean up any pending animation frames on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    // Cancel any pending animation frame to prevent stacking
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Use requestAnimationFrame to throttle updates
    animationFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current
      if (!card) return

      const rect = card.getBoundingClientRect()

      // Calculate mouse position relative to card center
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Calculate rotation based on mouse position and intensity
      const rotateXValue = (mouseY / (rect.height / 2)) * -intensity
      const rotateYValue = (mouseX / (rect.width / 2)) * intensity

      // Update rotation state
      setRotateX(rotateXValue)
      setRotateY(rotateYValue)

      // Update glare position
      const glareX = (mouseX / rect.width) * 100 + 50
      const glareY = (mouseY / rect.height) * 100 + 50
      setGlarePosition({ x: glareX, y: glareY })

      animationFrameRef.current = null
    })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className} ${border ? "overflow-hidden" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      animate={{
        transform: isHovering
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) ${scale ? "scale(1.05)" : "scale(1)"}`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)",
        boxShadow:
          isHovering && shadow
            ? `0 20px 40px rgba(0, 0, 0, 0.2), 
             ${rotateY / 5}px ${rotateX / 5}px 10px rgba(0, 0, 0, 0.1)`
            : "0 0 0 rgba(0, 0, 0, 0)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      {/* Card content */}
      <div className="relative z-10">{children}</div>

      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: isHovering
              ? `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 60%)`
              : "none",
          }}
          animate={{
            opacity: isHovering ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}

      {/* Border highlight */}
      {border && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none z-0"
          animate={{
            boxShadow: isHovering
              ? "inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0)",
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}
    </motion.div>
  )
}
