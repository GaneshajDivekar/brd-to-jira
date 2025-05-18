"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarChart3, Calculator } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Card3D from "@/components/card-3d"

const mockEstimations = [
  {
    id: "PROJ-1",
    title: "Implement Email Registration Flow",
    storyPoints: 5,
    complexity: "Medium",
    reasoning: [
      "Requires form validation",
      "Email verification flow",
      "Database integration",
      "Similar to previous tasks",
    ],
    confidence: 85,
  },
  {
    id: "PROJ-2",
    title: "Implement Social Media Registration",
    storyPoints: 8,
    complexity: "High",
    reasoning: [
      "Integration with multiple OAuth providers",
      "Complex user flow",
      "Security considerations",
      "Error handling for third-party services",
    ],
    confidence: 75,
  },
  {
    id: "PROJ-3",
    title: "Create Login Form with MFA Support",
    storyPoints: 5,
    complexity: "Medium",
    reasoning: [
      "Standard login form implementation",
      "MFA integration adds complexity",
      "Security best practices required",
      "Similar to previous authentication tasks",
    ],
    confidence: 90,
  },
]

export default function StoryPointEstimation() {
  const [estimations, setEstimations] = useState(mockEstimations)
  const [activeEstimation, setActiveEstimation] = useState<string | null>(null)
  const [showChart, setShowChart] = useState(false)

  useEffect(() => {
    // Show chart after a delay
    const timer = setTimeout(() => {
      setShowChart(true)
    }, 1000)

    // Simulate AI thinking by highlighting estimations in sequence
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * estimations.length)
      setActiveEstimation(estimations[randomIndex].id)

      setTimeout(() => {
        setActiveEstimation(null)
      }, 800)
    }, 4000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [estimations])

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getStoryPointColor = (points: number) => {
    if (points <= 3) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (points <= 5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-500"
    if (confidence >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Story Point Estimation</CardTitle>
              <CardDescription>AI-generated story point estimates based on complexity analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-medium">Estimation Summary</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card3D intensity={6} scale={false} className="rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border rounded-lg p-4 bg-white dark:bg-slate-950 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {estimations.reduce((sum, item) => sum + item.storyPoints, 0)}
                  </motion.div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Story Points</div>
                </motion.div>
              </Card3D>

              <Card3D intensity={6} scale={false} className="rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="border rounded-lg p-4 bg-white dark:bg-slate-950 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {(estimations.reduce((sum, item) => sum + item.storyPoints, 0) / estimations.length).toFixed(1)}
                  </motion.div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Points per Ticket</div>
                </motion.div>
              </Card3D>

              <Card3D intensity={6} scale={false} className="rounded-lg">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="border rounded-lg p-4 bg-white dark:bg-slate-950 text-center relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div
                    className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 mb-1"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {Math.round(estimations.reduce((sum, item) => sum + item.confidence, 0) / estimations.length)}%
                  </motion.div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Average Confidence</div>
                </motion.div>
              </Card3D>
            </div>

            {showChart && (
              <Card3D intensity={4} scale={false} className="rounded-lg">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.5 }}
                  className="border rounded-lg p-4 bg-white dark:bg-slate-950 mb-6"
                >
                  <h3 className="text-sm font-medium mb-4">Story Points Distribution</h3>
                  <div className="flex items-end h-40 gap-4 px-4">
                    {estimations.map((estimation, index) => (
                      <motion.div
                        key={estimation.id}
                        className="flex-1 flex flex-col items-center gap-2"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        <div className="text-xs font-medium">{estimation.storyPoints} SP</div>
                        <motion.div
                          className="w-full bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-md relative group"
                          initial={{ height: 0 }}
                          animate={{ height: `${(estimation.storyPoints / 10) * 100}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                        >
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                        <div className="text-xs text-gray-500 truncate w-full text-center">{estimation.id}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </Card3D>
            )}
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {estimations.map((estimation, index) => (
                <Card3D key={estimation.id} intensity={8} className="rounded-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.15 }}
                    className={`border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm transition-all duration-300 ${
                      activeEstimation === estimation.id
                        ? "border-indigo-500 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                        >
                          {estimation.id}
                        </Badge>
                        <h3 className="font-medium">{estimation.title}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge className={getComplexityColor(estimation.complexity)}>{estimation.complexity}</Badge>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, delay: 0.8 + index * 0.1 }}
                              >
                                <Badge className={getStoryPointColor(estimation.storyPoints)}>
                                  {estimation.storyPoints} SP
                                </Badge>
                              </motion.div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Story Points: {estimation.storyPoints}</p>
                              <p>Based on task complexity and historical data</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">AI Reasoning:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {estimation.reasoning.map((reason, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                          >
                            {reason}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">AI Confidence:</span>
                          <span className={`text-sm font-medium ${getConfidenceColor(estimation.confidence)}`}>
                            {estimation.confidence}%
                          </span>
                        </div>

                        <motion.div
                          className="text-xs px-2 py-1 rounded bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, delay: 1 + index * 0.1 }}
                        >
                          AI Estimated
                        </motion.div>
                      </div>

                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${estimation.confidence}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                          className="h-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 relative"
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </Card3D>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
