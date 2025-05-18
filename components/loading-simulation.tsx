"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

export default function LoadingSimulation() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("Initializing AI analysis...")
  const [particles, setParticles] = useState<{ x: number; y: number; size: number; speed: number; color: string }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const steps = [
    "Initializing AI analysis...",
    "Scanning document structure...",
    "Extracting requirements...",
    "Identifying user stories...",
    "Analyzing complexity...",
    "Preparing Jira ticket format...",
    "Matching developer skills...",
    "Estimating story points...",
    "Finalizing results...",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1.5
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(progress / (100 / steps.length)), steps.length - 1)
    setCurrentStep(steps[stepIndex])
  }, [progress])

  useEffect(() => {
    // Initialize particles
    const newParticles = []
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 1 + 0.5,
        color: `hsl(${Math.random() * 60 + 200}, 70%, 60%)`,
      })
    }
    setParticles(newParticles)

    // Animation loop for canvas
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      particles.forEach((particle, index) => {
        const x = (particle.x / 100) * canvas.width
        const y = (particle.y / 100) * canvas.height

        ctx.beginPath()
        ctx.arc(x, y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = 0.5
        ctx.fill()

        // Update particle position for next frame
        const newParticles = [...particles]
        newParticles[index] = {
          ...particle,
          y: (particle.y - particle.speed / 10) % 100,
        }
        setParticles(newParticles)
      })

      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardContent className="pt-6 relative">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

          <div className="flex flex-col items-center justify-center gap-6 py-8 relative z-10">
            <div className="relative h-40 w-40">
              <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900/30"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-500 dark:border-blue-400"
                style={{
                  clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% ${100 - progress}%)`,
                  transform: `rotate(${progress * 3.6}deg)`,
                  transition: "transform 0.3s ease, clip-path 0.3s ease",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{Math.round(progress)}%</span>
              </div>

              {/* Orbiting elements */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="absolute h-6 w-6 rounded-full bg-blue-500/20 dark:bg-blue-400/20 flex items-center justify-center"
                  style={{
                    left: `calc(50% + ${Math.cos((progress / 100) * Math.PI * 2 + (i * Math.PI * 2) / 3) * 80}px)`,
                    top: `calc(50% + ${Math.sin((progress / 100) * Math.PI * 2 + (i * Math.PI * 2) / 3) * 80}px)`,
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
                  }}
                >
                  <div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-md">
              <h3 className="text-center text-lg font-medium mb-3 min-h-[28px] relative">
                <span className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep}
                  </motion.span>
                </span>
              </h3>
              <Progress value={progress} className="h-3 bg-blue-100 dark:bg-blue-900/30">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </Progress>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
              Our AI is analyzing your document, extracting requirements, and preparing Jira tickets. This may take a
              moment...
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
