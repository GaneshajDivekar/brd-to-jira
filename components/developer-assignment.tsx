"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AlertTriangle, BarChart2, Filter, SortAsc, SortDesc, Users } from "lucide-react"
import { motion } from "framer-motion"
import Card3D from "@/components/card-3d"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockDevelopers = [
  {
    id: "dev-1",
    name: "Devesh",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "CSS"],
    workload: 65,
    assignedTickets: ["PROJ-1"],
    sprintCapacity: 10,
    currentSprintPoints: 5,
  },
  {
    id: "dev-2",
    name: "Akash",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Backend Developer",
    skills: ["Node.js", "API", "Database"],
    workload: 40,
    assignedTickets: ["PROJ-3"],
    sprintCapacity: 12,
    currentSprintPoints: 5,
  },
  {
    id: "dev-3",
    name: "Rajesh",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "AWS"],
    workload: 80,
    assignedTickets: ["PROJ-2"],
    sprintCapacity: 8,
    currentSprintPoints: 8,
  },
  {
    id: "dev-4",
    name: "Amurta",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "QA Engineer",
    skills: ["Testing", "Automation", "Documentation"],
    workload: 30,
    assignedTickets: [],
    sprintCapacity: 6,
    currentSprintPoints: 0,
  },
]

const mockTickets = [
  { id: "PROJ-1", title: "Implement Email Registration Flow", storyPoints: 5 },
  { id: "PROJ-2", title: "Implement Social Media Registration", storyPoints: 8 },
  { id: "PROJ-3", title: "Create Login Form with MFA Support", storyPoints: 5 },
]

const sprintInfo = {
  name: "Sprint 24",
  startDate: "May 10, 2025",
  endDate: "May 24, 2025",
  totalStoryPoints: 18,
  completedStoryPoints: 0,
}

type FilterOption = "all" | "overallocated" | "underallocated" | "optimal"
type SortOption = "name" | "points-asc" | "points-desc" | "capacity-asc" | "capacity-desc" | "workload"

export default function DeveloperAssignment() {
  const [developers, setDevelopers] = useState(mockDevelopers)
  const [filteredDevelopers, setFilteredDevelopers] = useState(mockDevelopers)
  const [highlightedDev, setHighlightedDev] = useState<string | null>(null)
  const [sprint, setSprint] = useState(sprintInfo)
  const [filterOption, setFilterOption] = useState<FilterOption>("all")
  const [sortOption, setSortOption] = useState<SortOption>("name")
  const [pointsThreshold, setPointsThreshold] = useState("0")

  useEffect(() => {
    // Simulate AI thinking by highlighting developers in sequence
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * developers.length)
      setHighlightedDev(developers[randomIndex].id)

      setTimeout(() => {
        setHighlightedDev(null)
      }, 800)
    }, 3000)

    return () => clearInterval(interval)
  }, [developers])

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...developers]

    // Apply filtering
    if (filterOption === "overallocated") {
      result = result.filter((dev) => dev.currentSprintPoints > dev.sprintCapacity)
    } else if (filterOption === "underallocated") {
      result = result.filter((dev) => dev.currentSprintPoints < dev.sprintCapacity * 0.7)
    } else if (filterOption === "optimal") {
      result = result.filter(
        (dev) => dev.currentSprintPoints >= dev.sprintCapacity * 0.7 && dev.currentSprintPoints <= dev.sprintCapacity,
      )
    }

    // Apply points threshold filter
    const threshold = Number.parseInt(pointsThreshold)
    if (!isNaN(threshold) && threshold > 0) {
      result = result.filter((dev) => dev.currentSprintPoints >= threshold)
    }

    // Apply sorting
    switch (sortOption) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "points-asc":
        result.sort((a, b) => a.currentSprintPoints - b.currentSprintPoints)
        break
      case "points-desc":
        result.sort((a, b) => b.currentSprintPoints - a.currentSprintPoints)
        break
      case "capacity-asc":
        result.sort((a, b) => a.sprintCapacity - b.sprintCapacity)
        break
      case "capacity-desc":
        result.sort((a, b) => b.sprintCapacity - a.sprintCapacity)
        break
      case "workload":
        result.sort((a, b) => b.workload - a.workload)
        break
    }

    setFilteredDevelopers(result)
  }, [developers, filterOption, sortOption, pointsThreshold])

  const getWorkloadColor = (workload: number) => {
    if (workload < 50) return "bg-green-500"
    if (workload < 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const isDeficient = (dev: (typeof mockDevelopers)[0]) => {
    return dev.currentSprintPoints > dev.sprintCapacity
  }

  const getCapacityUsagePercentage = (dev: (typeof mockDevelopers)[0]) => {
    return Math.round((dev.currentSprintPoints / dev.sprintCapacity) * 100)
  }

  const getCapacityColor = (dev: (typeof mockDevelopers)[0]) => {
    const percentage = getCapacityUsagePercentage(dev)
    if (percentage < 70) return "bg-green-500"
    if (percentage < 100) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/20 dark:shadow-purple-500/10">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Developer Assignment</CardTitle>
              <CardDescription>AI-suggested developer assignments based on skills and workload</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Sprint Overview */}
          <Card3D intensity={4} scale={false} className="rounded-lg mb-6">
            <div className="border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <h3 className="font-medium">Sprint Overview: {sprint.name}</h3>
                <span className="text-sm text-gray-500 ml-auto">
                  {sprint.startDate} - {sprint.endDate}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {sprint.totalStoryPoints}
                  </div>
                  <div className="text-xs text-gray-500">Total Story Points</div>
                </div>
                <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {sprint.completedStoryPoints}
                  </div>
                  <div className="text-xs text-gray-500">Completed Points</div>
                </div>
                <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {developers.reduce((sum, dev) => sum + dev.sprintCapacity, 0)}
                  </div>
                  <div className="text-xs text-gray-500">Team Capacity</div>
                </div>
                <div className="border rounded-lg p-3 bg-amber-50 dark:bg-amber-900/20 text-center">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                    {developers.filter(isDeficient).length}
                  </div>
                  <div className="text-xs text-gray-500">Overallocated Devs</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
                <div
                  className="h-2.5 rounded-full bg-purple-600 dark:bg-purple-400"
                  style={{ width: `${(sprint.completedStoryPoints / sprint.totalStoryPoints) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>
                  Sprint Progress: {Math.round((sprint.completedStoryPoints / sprint.totalStoryPoints) * 100)}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </Card3D>

          {/* Filtering and Sorting Controls */}
          <div className="flex flex-wrap gap-3 mb-6 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium">Filter:</span>
            </div>

            <Select value={filterOption} onValueChange={(value) => setFilterOption(value as FilterOption)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Filter developers" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Developer Status</SelectLabel>
                  <SelectItem value="all">All Developers</SelectItem>
                  <SelectItem value="overallocated">Overallocated</SelectItem>
                  <SelectItem value="underallocated">Underallocated</SelectItem>
                  <SelectItem value="optimal">Optimal Allocation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 ml-2">
              <span className="text-sm font-medium">Min SP:</span>
              <Select value={pointsThreshold} onValueChange={setPointsThreshold}>
                <SelectTrigger className="w-[100px] h-9">
                  <SelectValue placeholder="Points" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="3">≥ 3 SP</SelectItem>
                  <SelectItem value="5">≥ 5 SP</SelectItem>
                  <SelectItem value="8">≥ 8 SP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-medium">Sort:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    {sortOption === "points-desc" || sortOption === "capacity-desc" ? (
                      <SortDesc className="h-4 w-4" />
                    ) : (
                      <SortAsc className="h-4 w-4" />
                    )}
                    <span>
                      {sortOption === "name"
                        ? "Name"
                        : sortOption.includes("points")
                          ? "Story Points"
                          : sortOption.includes("capacity")
                            ? "Capacity"
                            : "Workload"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setSortOption("name")}>Name (A-Z)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("points-asc")}>
                      Story Points (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("points-desc")}>
                      Story Points (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("capacity-asc")}>
                      Capacity (Low to High)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("capacity-desc")}>
                      Capacity (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOption("workload")}>
                      Workload (Busiest First)
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {filteredDevelopers.length === 0 ? (
            <div className="text-center py-8 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <p className="text-gray-500 dark:text-gray-400">No developers match the current filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setFilterOption("all")
                  setPointsThreshold("0")
                  setSortOption("name")
                }}
              >
                Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredDevelopers.map((developer, index) => (
                <Card3D key={developer.id} intensity={7} className="rounded-lg">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm transition-colors duration-300 ${
                      highlightedDev === developer.id
                        ? "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : ""
                    } ${
                      isDeficient(developer) ? "border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-900/10" : ""
                    }`}
                  >
                    {isDeficient(developer) && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg z-10">
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {highlightedDev === developer.id && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-md"
                          />
                        )}
                        <img
                          src={developer.avatar || "/placeholder.svg"}
                          alt={developer.name}
                          className="h-16 w-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"
                                style={{
                                  background: getWorkloadColor(developer.workload),
                                }}
                              ></div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Workload: {developer.workload}%</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{developer.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{developer.role}</p>
                          </div>
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm">
                            {developer.currentSprintPoints} SP
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {developer.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Workload</span>
                        <span className="text-xs font-medium">{developer.workload}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${developer.workload}%` }}
                          transition={{ duration: 0.5, delay: 0.2 }}
                          className={`h-2 rounded-full ${getWorkloadColor(developer.workload)}`}
                        />
                      </div>
                    </div>

                    {/* Sprint Capacity */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">Sprint Capacity</span>
                        <span className="text-xs font-medium">
                          {developer.currentSprintPoints} / {developer.sprintCapacity} SP
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(developer.currentSprintPoints / developer.sprintCapacity) * 100}%` }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          className={`h-2 rounded-full ${getCapacityColor(developer)}`}
                        />
                      </div>
                      {isDeficient(developer) && (
                        <div className="mt-1 text-xs text-red-500 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            Overallocated by {developer.currentSprintPoints - developer.sprintCapacity} story points
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Assigned Tickets:</h4>
                      {developer.assignedTickets.length > 0 ? (
                        <div className="space-y-2">
                          {developer.assignedTickets.map((ticketId, idx) => {
                            const ticket = mockTickets.find((t) => t.id === ticketId)
                            return (
                              <div key={ticketId} className="flex items-center gap-2 text-sm">
                                <Badge
                                  variant="outline"
                                  className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                                >
                                  {ticketId}
                                </Badge>
                                <span className="truncate flex-1">{ticket?.title}</span>
                                <Badge
                                  variant="outline"
                                  className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800 shrink-0"
                                >
                                  {ticket?.storyPoints} SP
                                </Badge>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No tickets assigned yet</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">AI Match Score:</span>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={i < 5 - Math.floor(developer.workload / 20) ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  className="h-3 w-3 text-yellow-500"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs px-2 py-1 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                                AI Assigned
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Assignment based on skills, workload, and past performance</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </motion.div>
                </Card3D>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
