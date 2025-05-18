"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  BarChart3,
  BrainCircuit,
  ChevronDown,
  Filter,
  Info,
  Lightbulb,
  PieChart,
  RefreshCw,
  Sparkles,
  Users,
  CheckCircle2,
  Download,
  Share2,
  Zap,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Mock data for story points distribution
const mockSprintData = {
  currentSprint: "Sprint 24",
  previousSprints: ["Sprint 23", "Sprint 22", "Sprint 21"],
  totalStoryPoints: 87,
  completedStoryPoints: 32,
  averagePointsPerTicket: 5.4,
  confidenceScore: 92,
  distribution: {
    byPriority: [
      { name: "High", points: 34, color: "#f43f5e" },
      { name: "Medium", points: 42, color: "#0ea5e9" },
      { name: "Low", points: 11, color: "#10b981" },
    ],
    byType: [
      { name: "Story", points: 52, color: "#3b82f6" },
      { name: "Bug", points: 18, color: "#ec4899" },
      { name: "Task", points: 12, color: "#8b5cf6" },
      { name: "Epic", points: 5, color: "#6366f1" },
    ],
    byStatus: [
      { name: "To Do", points: 55, color: "#94a3b8" },
      { name: "In Progress", points: 20, color: "#3b82f6" },
      { name: "Done", points: 12, color: "#10b981" },
    ],
    byDeveloper: [
      { name: "Arjun Sharma", points: 18, capacity: 20, avatar: "/placeholder.svg?height=40&width=40&text=AS" },
      { name: "Priya Patel", points: 15, capacity: 18, avatar: "/placeholder.svg?height=40&width=40&text=PP" },
      { name: "Vikram Singh", points: 22, capacity: 20, avatar: "/placeholder.svg?height=40&width=40&text=VS" },
      { name: "Neha Gupta", points: 12, capacity: 15, avatar: "/placeholder.svg?height=40&width=40&text=NG" },
      { name: "Rahul Verma", points: 20, capacity: 18, avatar: "/placeholder.svg?height=40&width=40&text=RV" },
    ],
    byComplexity: [
      { name: "1 Point", count: 8, color: "#d1fae5" },
      { name: "2 Points", count: 12, color: "#a7f3d0" },
      { name: "3 Points", count: 15, color: "#6ee7b7" },
      { name: "5 Points", count: 10, color: "#34d399" },
      { name: "8 Points", count: 6, color: "#10b981" },
      { name: "13 Points", count: 3, color: "#059669" },
    ],
    trend: [
      { sprint: "Sprint 20", points: 65, completed: 62 },
      { sprint: "Sprint 21", points: 72, completed: 68 },
      { sprint: "Sprint 22", points: 78, completed: 70 },
      { sprint: "Sprint 23", points: 82, completed: 75 },
      { sprint: "Sprint 24", points: 87, completed: 32 },
    ],
  },
  aiInsights: [
    "Team velocity is increasing by an average of 6% per sprint",
    "High priority items make up 39% of total story points",
    "Vikram Singh is currently overallocated by 10%",
    "The team has a 92% completion rate over the last 3 sprints",
    "Consider redistributing 5-8 points from Vikram to Neha for better balance",
  ],
}

// Helper function to calculate the maximum value for chart scaling
const getMaxValue = (data: { points: number }[]) => {
  return Math.max(...data.map((item) => item.points)) * 1.2
}

export default function StoryPointsDistribution() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedSprint, setSelectedSprint] = useState(mockSprintData.currentSprint)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [filterThreshold, setFilterThreshold] = useState([0])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeInsight, setActiveInsight] = useState<number | null>(null)

  // Filtered developers based on the threshold
  const filteredDevelopers = useMemo(() => {
    return mockSprintData.distribution.byDeveloper.filter((dev) => dev.points >= filterThreshold[0])
  }, [filterThreshold])

  // Simulate data refresh
  const refreshData = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1500)
  }

  // Animate insights sequentially
  useEffect(() => {
    if (showAIInsights) {
      const interval = setInterval(() => {
        setActiveInsight((prev) => {
          if (prev === null || prev >= mockSprintData.aiInsights.length - 1) {
            return 0
          }
          return prev + 1
        })
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [showAIInsights])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="w-full max-w-6xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 dark:shadow-cyan-500/10">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl flex items-center gap-2 font-bold bg-gradient-to-r from-cyan-700 to-sky-700 dark:from-cyan-300 dark:to-sky-300 bg-clip-text text-transparent">
                  Story Points Distribution
                </CardTitle>
                <CardDescription className="text-base mt-1 text-slate-600 dark:text-slate-400">
                  Visualize and analyze story point allocation across your project
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedSprint} onValueChange={setSelectedSprint}>
                <SelectTrigger className="w-[180px] border-slate-200 dark:border-slate-700 rounded-xl">
                  <SelectValue placeholder="Select sprint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={mockSprintData.currentSprint}>{mockSprintData.currentSprint}</SelectItem>
                  {mockSprintData.previousSprints.map((sprint) => (
                    <SelectItem key={sprint} value={sprint}>
                      {sprint}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="icon"
                onClick={refreshData}
                className={`border-slate-200 dark:border-slate-700 rounded-xl ${isRefreshing ? "animate-spin" : ""}`}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* AI Insights Banner */}
          {showAIInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 relative overflow-hidden"
            >
              <div className="rounded-2xl border border-cyan-200 dark:border-cyan-800 bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 p-6 shadow-sm">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-cyan-500 to-sky-500 p-3.5 rounded-xl shadow-md shadow-cyan-500/10">
                    <BrainCircuit className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-h-[60px] flex items-center">
                    <AnimatePresence mode="wait">
                      {mockSprintData.aiInsights.map(
                        (insight, index) =>
                          activeInsight === index && (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.5 }}
                              className="flex items-center gap-3"
                            >
                              <Sparkles className="h-5 w-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                              <p className="text-cyan-800 dark:text-cyan-300 text-base">{insight}</p>
                            </motion.div>
                          ),
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex space-x-1.5">
                      {mockSprintData.aiInsights.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-2 rounded-full transition-colors duration-300 ${
                            activeInsight === index ? "bg-cyan-600 dark:bg-cyan-400" : "bg-cyan-200 dark:bg-cyan-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center">
                      <Switch id="ai-insights" checked={showAIInsights} onCheckedChange={setShowAIInsights} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Story Points</p>
                      <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-cyan-600 to-sky-600 dark:from-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
                        {mockSprintData.totalStoryPoints}
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-900/50 dark:to-sky-900/50 p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <span className="flex items-center text-green-600 dark:text-green-400">
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      6.1%
                    </span>
                    <span className="ml-1">vs previous sprint</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Points</p>
                      <h3 className="text-3xl font-bold mt-1 text-green-600 dark:text-green-400">
                        {mockSprintData.completedStoryPoints}
                      </h3>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900/50 p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(mockSprintData.completedStoryPoints / mockSprintData.totalStoryPoints) * 100}%`,
                        }}
                        transition={{ duration: 1 }}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
                      ></motion.div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((mockSprintData.completedStoryPoints / mockSprintData.totalStoryPoints) * 100)}%
                      complete
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Points Per Ticket</p>
                      <h3 className="text-3xl font-bold mt-1 text-sky-600 dark:text-sky-400">
                        {mockSprintData.averagePointsPerTicket}
                      </h3>
                    </div>
                    <div className="bg-sky-100 dark:bg-sky-900/50 p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <PieChart className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <span className="flex items-center text-amber-600 dark:text-amber-400">
                      <ChevronDown className="h-3 w-3 -rotate-90" />
                      0.2
                    </span>
                    <span className="ml-1">vs previous sprint</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">AI Confidence Score</p>
                      <h3 className="text-3xl font-bold mt-1 bg-gradient-to-r from-cyan-600 to-sky-600 dark:from-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
                        {mockSprintData.confidenceScore}%
                      </h3>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-900/50 dark:to-sky-900/50 p-2.5 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="flex items-center">
                          <Info className="h-3 w-3 mr-1" />
                          <span>What is this?</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px]">
                            AI confidence score represents how confident our AI is in the story point estimations based
                            on historical data and requirements clarity.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl">
              <TabsTrigger
                value="overview"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="developers"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                By Developer
              </TabsTrigger>
              <TabsTrigger
                value="complexity"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                By Complexity
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                Trends
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* By Priority */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-medium">By Priority</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[220px] flex items-end justify-around">
                      {mockSprintData.distribution.byPriority.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(item.points / getMaxValue(mockSprintData.distribution.byPriority)) * 170}px`,
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, type: "spring" }}
                            className="w-16 rounded-t-lg relative overflow-hidden"
                            style={{ backgroundColor: item.color }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.2 }}
                            />
                          </motion.div>
                          <div className="mt-3 text-center">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{item.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* By Type */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-medium">By Type</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[220px] flex items-end justify-around">
                      {mockSprintData.distribution.byType.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(item.points / getMaxValue(mockSprintData.distribution.byType)) * 170}px`,
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, type: "spring" }}
                            className="w-12 rounded-t-lg relative overflow-hidden"
                            style={{ backgroundColor: item.color }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.2 }}
                            />
                          </motion.div>
                          <div className="mt-3 text-center">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{item.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* By Status */}
                <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-medium">By Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[220px] flex items-end justify-around">
                      {mockSprintData.distribution.byStatus.map((item, index) => (
                        <div key={index} className="flex flex-col items-center group">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{
                              height: `${(item.points / getMaxValue(mockSprintData.distribution.byStatus)) * 170}px`,
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 + 0.2, type: "spring" }}
                            className="w-16 rounded-t-lg relative overflow-hidden"
                            style={{ backgroundColor: item.color }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                              initial={{ opacity: 0 }}
                              whileHover={{ opacity: 0.2 }}
                            />
                          </motion.div>
                          <div className="mt-3 text-center">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground mt-1">{item.points} pts</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pie Chart */}
              <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-medium">Overall Distribution</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <Download className="h-3.5 w-3.5" />
                        Export
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                        <Share2 className="h-3.5 w-3.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
                    <div className="relative w-[220px] h-[220px]">
                      <svg width="220" height="220" viewBox="0 0 220 220">
                        <motion.circle
                          cx="110"
                          cy="110"
                          r="85"
                          fill="transparent"
                          stroke="#f43f5e"
                          strokeWidth="30"
                          strokeDasharray="534"
                          strokeDashoffset="400"
                          initial={{ strokeDashoffset: 534 }}
                          animate={{ strokeDashoffset: 534 * (1 - 0.39) }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                        />
                        <motion.circle
                          cx="110"
                          cy="110"
                          r="85"
                          fill="transparent"
                          stroke="#0ea5e9"
                          strokeWidth="30"
                          strokeDasharray="534"
                          strokeDashoffset="267"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: 534 * (1 - 0.48) }}
                          transition={{ duration: 1.2, delay: 0.7, ease: "easeInOut" }}
                          transform="rotate(-90 110 110)"
                        />
                        <motion.circle
                          cx="110"
                          cy="110"
                          r="85"
                          fill="transparent"
                          stroke="#10b981"
                          strokeWidth="30"
                          strokeDasharray="534"
                          strokeDashoffset="467"
                          initial={{ strokeDashoffset: 0 }}
                          animate={{ strokeDashoffset: 534 * (1 - 0.13) }}
                          transition={{ duration: 1.2, delay: 0.9, ease: "easeInOut" }}
                          transform="rotate(80 110 110)"
                        />
                        <circle cx="110" cy="110" r="70" fill="white" className="dark:fill-slate-950" />
                        <text
                          x="110"
                          y="105"
                          textAnchor="middle"
                          className="text-2xl font-bold fill-slate-900 dark:fill-white"
                        >
                          {mockSprintData.totalStoryPoints}
                        </text>
                        <text
                          x="110"
                          y="130"
                          textAnchor="middle"
                          className="text-sm fill-slate-500 dark:fill-slate-400"
                        >
                          Total Points
                        </text>
                      </svg>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {mockSprintData.distribution.byPriority.map((item, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-5 h-5 rounded-md" style={{ backgroundColor: item.color }}></div>
                          <div className="flex-1 font-medium">{item.name}</div>
                          <div className="font-medium">{item.points} pts</div>
                          <div className="text-muted-foreground bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm">
                            {Math.round((item.points / mockSprintData.totalStoryPoints) * 100)}%
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Developers Tab */}
            <TabsContent value="developers" className="space-y-8">
              <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle className="text-lg font-medium">Developer Workload</CardTitle>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Min Points:</span>
                      </div>
                      <div className="w-[150px]">
                        <Slider
                          value={filterThreshold}
                          min={0}
                          max={25}
                          step={1}
                          onValueChange={setFilterThreshold}
                          className="[&>span]:bg-cyan-500 [&>span]:h-2 [&>span]:rounded-full"
                        />
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800"
                      >
                        {filterThreshold[0]}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {filteredDevelopers.map((developer, index) => (
                      <motion.div
                        key={developer.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={developer.avatar || "/placeholder.svg"}
                            alt={developer.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium truncate text-base">{developer.name}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {developer.points} / {developer.capacity} pts
                              </span>
                              {developer.points > developer.capacity && (
                                <Badge variant="destructive" className="text-xs">
                                  Overallocated
                                </Badge>
                              )}
                              {developer.points < developer.capacity * 0.7 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                >
                                  Underallocated
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(developer.points / developer.capacity) * 100}%` }}
                              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                              className={`h-full rounded-full ${
                                developer.points > developer.capacity
                                  ? "bg-gradient-to-r from-red-500 to-pink-500"
                                  : developer.points > developer.capacity * 0.8
                                    ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                    : "bg-gradient-to-r from-cyan-500 to-sky-500"
                              }`}
                            />
                          </div>
                          <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                            <span>0</span>
                            <span>Capacity: {developer.capacity} pts</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {filteredDevelopers.length === 0 && (
                      <div className="text-center py-12 text-muted-foreground bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                        <Users className="h-12 w-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                        <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                          No developers match the current filter criteria
                        </p>
                        <Button
                          variant="link"
                          onClick={() => setFilterThreshold([0])}
                          className="mt-2 text-cyan-600 dark:text-cyan-400"
                        >
                          Reset filter
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-lg font-medium">Team Allocation</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-12 py-4">
                    <div className="relative w-[220px] h-[220px]">
                      <svg width="220" height="220" viewBox="0 0 220 220">
                        <circle
                          cx="110"
                          cy="110"
                          r="95"
                          fill="transparent"
                          stroke="#e2e8f0"
                          strokeWidth="20"
                          className="dark:stroke-slate-700"
                        />
                        <motion.circle
                          cx="110"
                          cy="110"
                          r="95"
                          fill="transparent"
                          stroke="#0ea5e9"
                          strokeWidth="20"
                          strokeDasharray="596.9"
                          strokeDashoffset="0"
                          initial={{ strokeDashoffset: 596.9 }}
                          animate={{ strokeDashoffset: 596.9 * (1 - 0.87) }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          transform="rotate(-90 110 110)"
                        />
                        <circle cx="110" cy="110" r="75" fill="white" className="dark:fill-slate-950" />
                        <text
                          x="110"
                          y="105"
                          textAnchor="middle"
                          className="text-2xl font-bold fill-slate-900 dark:fill-white"
                        >
                          87%
                        </text>
                        <text
                          x="110"
                          y="130"
                          textAnchor="middle"
                          className="text-sm fill-slate-500 dark:fill-slate-400"
                        >
                          Allocation
                        </text>
                      </svg>
                    </div>

                    <div className="space-y-6 flex-1">
                      <div>
                        <h4 className="font-medium mb-3 text-lg">Team Capacity</h4>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <span className="text-sm text-muted-foreground">Current Allocation</span>
                              <span className="text-sm font-medium">87 / 100 pts</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "87%" }}
                                transition={{ duration: 1 }}
                                className="bg-gradient-to-r from-cyan-500 to-sky-500 h-3 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Optimal Allocation</div>
                          <div className="text-xl font-medium text-green-600 dark:text-green-400 mt-1">
                            3 Developers
                          </div>
                        </motion.div>
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Overallocated</div>
                          <div className="text-xl font-medium text-red-600 dark:text-red-400 mt-1">1 Developer</div>
                        </motion.div>
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Underallocated</div>
                          <div className="text-xl font-medium text-amber-600 dark:text-amber-400 mt-1">1 Developer</div>
                        </motion.div>
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border-cyan-200 dark:border-cyan-800 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Avg. Per Developer</div>
                          <div className="text-xl font-medium text-cyan-600 dark:text-cyan-400 mt-1">17.4 pts</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complexity Tab */}
            <TabsContent value="complexity" className="space-y-8">
              <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <CardTitle className="text-lg font-medium">Story Points by Complexity</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="h-[300px] flex items-end justify-around py-4">
                    {mockSprintData.distribution.byComplexity.map((item, index) => (
                      <div key={index} className="flex flex-col items-center group">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{
                            height: `${(item.count / Math.max(...mockSprintData.distribution.byComplexity.map((i) => i.count))) * 250}px`,
                          }}
                          transition={{ duration: 0.8, delay: index * 0.1 + 0.2, type: "spring" }}
                          className="w-16 sm:w-24 rounded-t-lg relative overflow-hidden"
                          style={{ backgroundColor: item.color }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 0.2 }}
                          />
                          <motion.div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.count} tickets
                          </motion.div>
                        </motion.div>
                        <div className="mt-3 text-center">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">{item.count} tickets</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-medium">Complexity Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="relative w-full h-[250px]">
                      <svg width="100%" height="100%" viewBox="0 0 400 250">
                        <motion.path
                          d="M 50,200 Q 100,100 150,180 Q 200,260 250,150 Q 300,40 350,120"
                          fill="transparent"
                          stroke="url(#complexityGradient)"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                        />

                        <defs>
                          <linearGradient id="complexityGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#06b6d4" />
                          </linearGradient>
                        </defs>

                        {/* X-axis */}
                        <line x1="50" y1="200" x2="350" y2="200" stroke="#94a3b8" strokeWidth="1" />

                        {/* Y-axis */}
                        <line x1="50" y1="50" x2="50" y2="200" stroke="#94a3b8" strokeWidth="1" />

                        {/* X-axis labels */}
                        <text x="50" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          1
                        </text>
                        <text x="100" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          2
                        </text>
                        <text x="150" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          3
                        </text>
                        <text x="200" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          5
                        </text>
                        <text x="250" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          8
                        </text>
                        <text x="300" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          13
                        </text>
                        <text x="350" y="220" textAnchor="middle" className="text-xs fill-slate-500">
                          21
                        </text>

                        {/* Y-axis labels */}
                        <text x="40" y="200" textAnchor="end" className="text-xs fill-slate-500">
                          0
                        </text>
                        <text x="40" y="150" textAnchor="end" className="text-xs fill-slate-500">
                          5
                        </text>
                        <text x="40" y="100" textAnchor="end" className="text-xs fill-slate-500">
                          10
                        </text>
                        <text x="40" y="50" textAnchor="end" className="text-xs fill-slate-500">
                          15
                        </text>

                        {/* Data points */}
                        <motion.circle
                          cx="50"
                          cy="200"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 0.6 }}
                        />
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 0.7 }}
                        />
                        <motion.circle
                          cx="150"
                          cy="180"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 0.8 }}
                        />
                        <motion.circle
                          cx="200"
                          cy="260"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 0.9 }}
                        />
                        <motion.circle
                          cx="250"
                          cy="150"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 1.0 }}
                        />
                        <motion.circle
                          cx="300"
                          cy="40"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 1.1 }}
                        />
                        <motion.circle
                          cx="350"
                          cy="120"
                          r="5"
                          fill="#0ea5e9"
                          initial={{ r: 0 }}
                          animate={{ r: 5 }}
                          transition={{ delay: 1.2 }}
                        />

                        {/* Axis titles */}
                        <text
                          x="200"
                          y="240"
                          textAnchor="middle"
                          className="text-sm fill-slate-700 dark:fill-slate-300"
                        >
                          Story Points
                        </text>
                        <text
                          x="20"
                          y="125"
                          textAnchor="middle"
                          transform="rotate(-90 20,125)"
                          className="text-sm fill-slate-700 dark:fill-slate-300"
                        >
                          Number of Tickets
                        </text>
                      </svg>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <CardTitle className="text-lg font-medium">Complexity Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-5">
                      <motion.div
                        className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border border-cyan-100 dark:border-cyan-800 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="bg-gradient-to-br from-cyan-500 to-sky-500 p-2.5 rounded-xl shadow-md shadow-cyan-500/10 mt-0.5">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-cyan-800 dark:text-cyan-300 text-lg">Distribution Pattern</h4>
                          <p className="text-cyan-700 dark:text-cyan-400 mt-2">
                            Your team follows a Fibonacci-like distribution with most tickets in the 2-5 point range,
                            which aligns with industry best practices.
                          </p>
                        </div>
                      </motion.div>

                      <div className="grid grid-cols-2 gap-4">
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.4 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Most Common</div>
                          <div className="text-xl font-medium mt-1">3 Points</div>
                          <div className="text-sm text-muted-foreground mt-1">15 tickets</div>
                        </motion.div>
                        <motion.div
                          className="border rounded-xl p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="text-sm text-muted-foreground">Least Common</div>
                          <div className="text-xl font-medium mt-1">13 Points</div>
                          <div className="text-sm text-muted-foreground mt-1">3 tickets</div>
                        </motion.div>
                      </div>

                      <motion.div
                        className="border rounded-xl p-5 bg-gradient-to-r from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20 border-cyan-200 dark:border-cyan-800 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <h4 className="font-medium mb-3 flex items-center gap-2 text-lg">
                          <BrainCircuit className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                          <span className="bg-gradient-to-r from-cyan-600 to-sky-600 dark:from-cyan-400 dark:to-sky-400 bg-clip-text text-transparent">
                            AI Recommendation
                          </span>
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300">
                          Consider breaking down the 13-point tickets into smaller tasks. Our analysis shows that
                          tickets estimated at 8+ points often face delays and scope creep.
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-8">
              <Card className="border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark\
