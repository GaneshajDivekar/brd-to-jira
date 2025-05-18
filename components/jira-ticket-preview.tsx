"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Edit,
  Link2,
  Link2Off,
  MessageSquare,
  MoreHorizontal,
  Send,
  Ticket,
  User,
} from "lucide-react"
import { motion, AnimatePresence, useDragControls } from "framer-motion"
import Card3D from "@/components/card-3d"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Dependency = {
  from: string
  to: string
  type: "blocks" | "is-blocked-by" | "relates-to"
}

const mockJiraTickets = [
  {
    id: "PROJ-1",
    title: "Implement Email Registration Flow",
    type: "Story",
    status: "To Do",
    priority: "High",
    description:
      "As a user, I want to register with my email address so that I can create an account and access the application.",
    acceptanceCriteria: [
      "User can enter email, password, and name",
      "System validates email format",
      "System checks for duplicate emails",
      "User receives confirmation email",
    ],
    linkedItems: ["US-1", "FT-1", "EP-1"],
    assignee: "dev-1",
    storyPoints: 5,
    comments: [
      {
        id: "comment-1",
        author: "Alex Johnson",
        authorId: "dev-1",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "I'll start working on this tomorrow. Need to clarify the email verification flow first.",
        timestamp: "2025-05-14T14:30:00Z",
      },
      {
        id: "comment-2",
        author: "Sarah Client",
        authorId: "client-1",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "Please make sure we're using the new email template for the verification emails.",
        timestamp: "2025-05-14T15:45:00Z",
      },
    ],
  },
  {
    id: "PROJ-2",
    title: "Implement Social Media Registration",
    type: "Story",
    status: "To Do",
    priority: "Medium",
    description:
      "As a user, I want to register using my social media accounts so that I can quickly create an account without entering all my details manually.",
    acceptanceCriteria: [
      "User can click on social media icons",
      "System redirects to OAuth flow",
      "System creates account with social profile data",
      "User is redirected back to the application",
    ],
    linkedItems: ["US-2", "FT-1", "EP-1"],
    assignee: "dev-3",
    storyPoints: 8,
    comments: [
      {
        id: "comment-3",
        author: "Taylor Kim",
        authorId: "dev-3",
        avatar: "/placeholder.svg?height=40&width=40",
        content: "We need to decide which social platforms to support in the first release.",
        timestamp: "2025-05-14T16:20:00Z",
      },
    ],
  },
  {
    id: "PROJ-3",
    title: "Create Login Form with MFA Support",
    type: "Story",
    status: "To Do",
    priority: "High",
    description:
      "As a user, I want to log in to the application with my credentials and have the option to use multi-factor authentication for added security.",
    acceptanceCriteria: [
      "User can enter email/username and password",
      "System validates credentials",
      "System prompts for MFA if enabled",
      "User is redirected to dashboard on successful login",
    ],
    linkedItems: ["US-3", "FT-2", "EP-1"],
    assignee: "dev-2",
    storyPoints: 5,
    comments: [],
  },
]

// Initial dependencies
const initialDependencies: Dependency[] = [
  { from: "PROJ-1", to: "PROJ-3", type: "blocks" },
  { from: "PROJ-2", to: "PROJ-3", type: "relates-to" },
]

const mockUsers = [
  {
    id: "client-1",
    name: "Sarah Client",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Owner",
  },
  {
    id: "client-2",
    name: "Mike Stakeholder",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Business Analyst",
  },
  {
    id: "current-user",
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Current User",
  },
]

export default function JiraTicketPreview() {
  const [tickets, setTickets] = useState(mockJiraTickets)
  const [editingTicket, setEditingTicket] = useState<string | null>(null)
  const [editedTitle, setEditedTitle] = useState("")
  const [activeTab, setActiveTab] = useState("kanban")
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [dependencies, setDependencies] = useState<Dependency[]>(initialDependencies)
  const [showDependencies, setShowDependencies] = useState(true)
  const [newDependency, setNewDependency] = useState<{ from: string; to: string; type: Dependency["type"] }>({
    from: "",
    to: "",
    type: "blocks",
  })
  const [dependencyDialogOpen, setDependencyDialogOpen] = useState(false)

  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)
  const kanbanRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Update SVG lines for dependencies when tickets or dependencies change
  useEffect(() => {
    if (activeTab !== "kanban" || !showDependencies) return

    const updateDependencyLines = () => {
      if (!kanbanRef.current || !svgRef.current) return

      // Clear existing lines
      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild)
      }

      // Get ticket elements
      const ticketElements: { [key: string]: DOMRect } = {}
      tickets.forEach((ticket) => {
        const element = document.getElementById(`ticket-${ticket.id}`)
        if (element) {
          ticketElements[ticket.id] = element.getBoundingClientRect()
        }
      })

      // Create SVG paths for dependencies
      dependencies.forEach((dep) => {
        const fromRect = ticketElements[dep.from]
        const toRect = ticketElements[dep.to]

        if (!fromRect || !toRect) return

        const kanbanRect = kanbanRef.current!.getBoundingClientRect()

        // Calculate path coordinates relative to the SVG container
        const fromX = fromRect.left + fromRect.width / 2 - kanbanRect.left
        const fromY = fromRect.top + fromRect.height / 2 - kanbanRect.top
        const toX = toRect.left + toRect.width / 2 - kanbanRect.left
        const toY = toRect.top + toRect.height / 2 - kanbanRect.top

        // Create path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")

        // Determine path color based on dependency type
        let strokeColor = "#6366f1" // Default indigo color
        let dashArray = ""

        if (dep.type === "blocks") {
          strokeColor = "#ef4444" // Red for blocking
        } else if (dep.type === "is-blocked-by") {
          strokeColor = "#f97316" // Orange for blocked by
        } else if (dep.type === "relates-to") {
          strokeColor = "#3b82f6" // Blue for relates to
          dashArray = "5,5" // Dashed line for relates-to
        }

        // Calculate control points for the curve
        const dx = Math.abs(toX - fromX) * 0.5
        const controlX1 = fromX + dx
        const controlX2 = toX - dx

        // Create the path
        path.setAttribute("d", `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`)
        path.setAttribute("stroke", strokeColor)
        path.setAttribute("stroke-width", "2")
        path.setAttribute("fill", "none")
        path.setAttribute("marker-end", "url(#arrowhead)")

        if (dashArray) {
          path.setAttribute("stroke-dasharray", dashArray)
        }

        svgRef.current!.appendChild(path)
      })
    }

    // Update lines initially and on window resize
    updateDependencyLines()
    window.addEventListener("resize", updateDependencyLines)

    return () => {
      window.removeEventListener("resize", updateDependencyLines)
    }
  }, [tickets, dependencies, activeTab, showDependencies])

  const handleEditClick = (ticketId: string, title: string) => {
    setEditingTicket(ticketId)
    setEditedTitle(title)
  }

  const handleSaveEdit = (ticketId: string) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, title: editedTitle } : ticket)))
    setEditingTicket(null)
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)))
  }

  const handleAddComment = (ticketId: string) => {
    if (!commentText.trim()) return

    const newComment = {
      id: `comment-${Date.now()}`,
      author: "You",
      authorId: "current-user",
      avatar: "/placeholder.svg?height=40&width=40",
      content: commentText,
      timestamp: new Date().toISOString(),
    }

    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, comments: [...ticket.comments, newComment] } : ticket,
      ),
    )
    setCommentText("")
  }

  const handleAddDependency = () => {
    if (newDependency.from && newDependency.to && newDependency.from !== newDependency.to) {
      // Check for circular dependencies
      const isCircular = checkForCircularDependency(newDependency.from, newDependency.to)

      if (isCircular) {
        alert("Cannot add this dependency as it would create a circular dependency.")
        return
      }

      // Check if dependency already exists
      const existingDep = dependencies.find((dep) => dep.from === newDependency.from && dep.to === newDependency.to)

      if (existingDep) {
        // Update existing dependency type
        setDependencies(
          dependencies.map((dep) =>
            dep.from === newDependency.from && dep.to === newDependency.to ? { ...dep, type: newDependency.type } : dep,
          ),
        )
      } else {
        // Add new dependency
        setDependencies([...dependencies, { ...newDependency }])
      }

      setDependencyDialogOpen(false)
      setNewDependency({ from: "", to: "", type: "blocks" })
    }
  }

  const handleRemoveDependency = (fromId: string, toId: string) => {
    setDependencies(dependencies.filter((dep) => !(dep.from === fromId && dep.to === toId)))
  }

  // Check if adding a dependency would create a circular dependency
  const checkForCircularDependency = (fromId: string, toId: string): boolean => {
    // If we're adding A -> B, check if there's already a path from B -> A
    const visited = new Set<string>()

    const dfs = (currentId: string, targetId: string): boolean => {
      if (currentId === targetId) return true
      if (visited.has(currentId)) return false

      visited.add(currentId)

      // Find all dependencies where current ticket is the source
      const outgoingDeps = dependencies.filter((dep) => dep.from === currentId)

      for (const dep of outgoingDeps) {
        if (dfs(dep.to, targetId)) return true
      }

      return false
    }

    return dfs(toId, fromId)
  }

  const getTicketDependencies = (ticketId: string) => {
    return {
      blocks: dependencies.filter((dep) => dep.from === ticketId && dep.type === "blocks").map((dep) => dep.to),
      blockedBy: dependencies.filter((dep) => dep.to === ticketId && dep.type === "blocks").map((dep) => dep.from),
      relatesTo: dependencies
        .filter((dep) => (dep.from === ticketId || dep.to === ticketId) && dep.type === "relates-to")
        .map((dep) => (dep.from === ticketId ? dep.to : dep.from)),
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "To Do":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
              <Ticket className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Jira Ticket Preview</CardTitle>
              <CardDescription>AI-generated Jira tickets based on extracted requirements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="kanban" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/50">
                <TabsTrigger
                  value="kanban"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
                >
                  Kanban View
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
                >
                  List View
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDependencies(!showDependencies)}
                  className={showDependencies ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                >
                  {showDependencies ? <Link2 className="h-4 w-4 mr-2" /> : <Link2Off className="h-4 w-4 mr-2" />}
                  {showDependencies ? "Hide Dependencies" : "Show Dependencies"}
                </Button>
              </div>

              <Dialog open={dependencyDialogOpen} onOpenChange={setDependencyDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Link2 className="h-4 w-4 mr-2" />
                    Add Dependency
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Ticket Dependency</DialogTitle>
                    <DialogDescription>Create a dependency relationship between two tickets.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="from" className="text-right">
                        From:
                      </label>
                      <Select
                        value={newDependency.from}
                        onValueChange={(value) => setNewDependency({ ...newDependency, from: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select ticket" />
                        </SelectTrigger>
                        <SelectContent>
                          {tickets.map((ticket) => (
                            <SelectItem key={ticket.id} value={ticket.id}>
                              {ticket.id}: {ticket.title.substring(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="type" className="text-right">
                        Type:
                      </label>
                      <Select
                        value={newDependency.type}
                        onValueChange={(value) =>
                          setNewDependency({
                            ...newDependency,
                            type: value as Dependency["type"],
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Dependency type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blocks">Blocks</SelectItem>
                          <SelectItem value="is-blocked-by">Is Blocked By</SelectItem>
                          <SelectItem value="relates-to">Relates To</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="to" className="text-right">
                        To:
                      </label>
                      <Select
                        value={newDependency.to}
                        onValueChange={(value) => setNewDependency({ ...newDependency, to: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select ticket" />
                        </SelectTrigger>
                        <SelectContent>
                          {tickets
                            .filter((ticket) => ticket.id !== newDependency.from)
                            .map((ticket) => (
                              <SelectItem key={ticket.id} value={ticket.id}>
                                {ticket.id}: {ticket.title.substring(0, 30)}...
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={handleAddDependency}>
                      Add Dependency
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="kanban">
              <div className="relative" ref={kanbanRef}>
                {/* SVG overlay for dependency arrows */}
                {showDependencies && (
                  <svg
                    ref={svgRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    style={{ overflow: "visible" }}
                  >
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6366f1" />
                      </marker>
                    </defs>
                  </svg>
                )}

                <div className="grid grid-cols-3 gap-4" ref={constraintsRef}>
                  {["To Do", "In Progress", "Done"].map((status) => (
                    <div key={status} className="flex flex-col" data-status={status}>
                      <div className="flex items-center gap-2 mb-3 px-2">
                        {status === "To Do" ? (
                          <Clock className="h-4 w-4 text-gray-500" />
                        ) : status === "In Progress" ? (
                          <ArrowRight className="h-4 w-4 text-blue-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                        <h3 className="font-medium">{status}</h3>
                        <Badge variant="outline" className="ml-auto">
                          {tickets.filter((t) => t.status === status).length}
                        </Badge>
                      </div>

                      <motion.div
                        className="space-y-3 min-h-[200px]"
                        animate={{ minHeight: tickets.filter((t) => t.status === status).length ? "200px" : "100px" }}
                      >
                        <AnimatePresence>
                          {tickets
                            .filter((ticket) => ticket.status === status)
                            .map((ticket) => (
                              <motion.div
                                key={ticket.id}
                                id={`ticket-${ticket.id}`}
                                layoutId={ticket.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8, zIndex: -1 }}
                                whileDrag={{ scale: 1.05, zIndex: 1, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)" }}
                                drag={activeTab === "kanban"}
                                dragControls={dragControls}
                                dragConstraints={constraintsRef}
                                dragElastic={0.1}
                                onDragEnd={(e, info) => {
                                  // Determine which column the ticket was dropped in
                                  const element = document.elementFromPoint(info.point.x, info.point.y)
                                  const column = element?.closest("[data-status]")
                                  if (column) {
                                    const newStatus = column.getAttribute("data-status")
                                    if (newStatus) {
                                      handleStatusChange(ticket.id, newStatus)
                                    }
                                  }
                                }}
                                className="cursor-grab active:cursor-grabbing"
                                data-status={ticket.status}
                                onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                              >
                                <Card3D intensity={5} className="rounded-lg">
                                  <div className="border rounded-lg p-3 bg-white dark:bg-slate-950 shadow-sm">
                                    <div className="flex items-start justify-between mb-2">
                                      <Badge variant="outline">{ticket.id}</Badge>
                                      <div className="flex gap-1">
                                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                                        <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                                          {ticket.storyPoints} SP
                                        </Badge>
                                      </div>
                                    </div>

                                    {editingTicket === ticket.id ? (
                                      <div className="mb-2">
                                        <Input
                                          value={editedTitle}
                                          onChange={(e) => setEditedTitle(e.target.value)}
                                          className="mb-2"
                                        />
                                        <Button size="sm" onClick={() => handleSaveEdit(ticket.id)} className="w-full">
                                          Save
                                        </Button>
                                      </div>
                                    ) : (
                                      <div className="flex justify-between items-start">
                                        <h4 className="font-medium mb-2">{ticket.title}</h4>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6 -mt-1 -mr-1 opacity-70 hover:opacity-100 transition-opacity"
                                            >
                                              <MoreHorizontal className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleEditClick(ticket.id, ticket.title)}>
                                              <Edit className="h-3 w-3 mr-2" /> Edit Title
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "To Do")}>
                                              <Badge
                                                variant="outline"
                                                className="h-2 w-2 mr-2 bg-gray-200 dark:bg-gray-700"
                                              />
                                              Move to To Do
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                              onClick={() => handleStatusChange(ticket.id, "In Progress")}
                                            >
                                              <Badge
                                                variant="outline"
                                                className="h-2 w-2 mr-2 bg-blue-200 dark:bg-blue-700"
                                              />
                                              Move to In Progress
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "Done")}>
                                              <Badge
                                                variant="outline"
                                                className="h-2 w-2 mr-2 bg-green-200 dark:bg-green-700"
                                              />
                                              Move to Done
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    )}

                                    <div className="flex flex-wrap gap-1 mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {ticket.type}
                                      </Badge>
                                      {ticket.linkedItems.map((item) => (
                                        <Badge
                                          key={item}
                                          variant="outline"
                                          className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        >
                                          {item}
                                        </Badge>
                                      ))}
                                    </div>

                                    {/* Dependencies badges */}
                                    {showDependencies && (
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {getTicketDependencies(ticket.id).blocks.length > 0 && (
                                          <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                            Blocks: {getTicketDependencies(ticket.id).blocks.length}
                                          </Badge>
                                        )}
                                        {getTicketDependencies(ticket.id).blockedBy.length > 0 && (
                                          <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                                            Blocked by: {getTicketDependencies(ticket.id).blockedBy.length}
                                          </Badge>
                                        )}
                                        {getTicketDependencies(ticket.id).relatesTo.length > 0 && (
                                          <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            Related: {getTicketDependencies(ticket.id).relatesTo.length}
                                          </Badge>
                                        )}
                                      </div>
                                    )}

                                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                                      <div className="flex items-center gap-1">
                                        <User className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{ticket.assignee}</span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">{ticket.comments.length}</span>
                                      </div>
                                    </div>

                                    {/* Comments section (expanded when ticket is selected) */}
                                    {selectedTicket === ticket.id && (
                                      <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800"
                                        style={{ height: "auto" }}
                                      >
                                        {/* Dependencies section */}
                                        {showDependencies && (
                                          <div className="mb-3">
                                            <h5 className="text-xs font-medium mb-2 flex items-center">
                                              <Link2 className="h-3 w-3 mr-1" /> Dependencies
                                            </h5>

                                            {/* Blocks */}
                                            {getTicketDependencies(ticket.id).blocks.length > 0 && (
                                              <div className="mb-2">
                                                <div className="text-xs text-red-600 dark:text-red-400 mb-1">
                                                  Blocks:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                  {getTicketDependencies(ticket.id).blocks.map((toId) => (
                                                    <div
                                                      key={`${ticket.id}-blocks-${toId}`}
                                                      className="flex items-center"
                                                    >
                                                      <Badge
                                                        variant="outline"
                                                        className="text-xs bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 flex items-center gap-1"
                                                      >
                                                        {toId}
                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          className="h-4 w-4 p-0 ml-1"
                                                          onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveDependency(ticket.id, toId)
                                                          }}
                                                        >
                                                          <Link2Off className="h-2 w-2" />
                                                        </Button>
                                                      </Badge>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Blocked By */}
                                            {getTicketDependencies(ticket.id).blockedBy.length > 0 && (
                                              <div className="mb-2">
                                                <div className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                                                  Blocked By:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                  {getTicketDependencies(ticket.id).blockedBy.map((fromId) => (
                                                    <div
                                                      key={`${fromId}-blocks-${ticket.id}`}
                                                      className="flex items-center"
                                                    >
                                                      <Badge
                                                        variant="outline"
                                                        className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 flex items-center gap-1"
                                                      >
                                                        {fromId}
                                                        <Button
                                                          variant="ghost"
                                                          size="icon"
                                                          className="h-4 w-4 p-0 ml-1"
                                                          onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleRemoveDependency(fromId, ticket.id)
                                                          }}
                                                        >
                                                          <Link2Off className="h-2 w-2" />
                                                        </Button>
                                                      </Badge>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}

                                            {/* Related To */}
                                            {getTicketDependencies(ticket.id).relatesTo.length > 0 && (
                                              <div className="mb-2">
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                                                  Related To:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                  {getTicketDependencies(ticket.id).relatesTo.map((relatedId) => {
                                                    // Find the dependency to get the direction
                                                    const dep = dependencies.find(
                                                      (d) =>
                                                        d.type === "relates-to" &&
                                                        ((d.from === ticket.id && d.to === relatedId) ||
                                                          (d.to === ticket.id && d.from === relatedId)),
                                                    )

                                                    const fromId = dep?.from || ""
                                                    const toId = dep?.to || ""

                                                    return (
                                                      <div
                                                        key={`${fromId}-relates-${toId}`}
                                                        className="flex items-center"
                                                      >
                                                        <Badge
                                                          variant="outline"
                                                          className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-1"
                                                        >
                                                          {relatedId}
                                                          <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-4 w-4 p-0 ml-1"
                                                            onClick={(e) => {
                                                              e.stopPropagation()
                                                              handleRemoveDependency(fromId, toId)
                                                            }}
                                                          >
                                                            <Link2Off className="h-2 w-2" />
                                                          </Button>
                                                        </Badge>
                                                      </div>
                                                    )
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        <div className="mb-2">
                                          <h5 className="text-xs font-medium mb-2 flex items-center">
                                            <MessageSquare className="h-3 w-3 mr-1" /> Comments
                                          </h5>
                                          <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {ticket.comments.map((comment) => (
                                              <div
                                                key={comment.id}
                                                className="flex gap-2 text-xs p-2 rounded-md bg-gray-50 dark:bg-gray-900"
                                              >
                                                <Avatar className="h-5 w-5 flex-shrink-0">
                                                  <AvatarImage
                                                    src={comment.avatar || "/placeholder.svg"}
                                                    alt={comment.author}
                                                  />
                                                  <AvatarFallback>
                                                    {comment.author
                                                      .split(" ")
                                                      .map((n) => n[0])
                                                      .join("")}
                                                  </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex justify-between">
                                                    <span className="font-medium">{comment.author}</span>
                                                    <span className="text-gray-400 text-[10px]">
                                                      {formatDate(comment.timestamp)}
                                                    </span>
                                                  </div>
                                                  <p className="mt-1 break-words">{comment.content}</p>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                          <Input
                                            placeholder="Add a comment..."
                                            className="text-xs h-7"
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault()
                                                handleAddComment(ticket.id)
                                              }
                                            }}
                                          />
                                          <Button
                                            size="icon"
                                            className="h-7 w-7 flex-shrink-0"
                                            onClick={() => handleAddComment(ticket.id)}
                                            disabled={!commentText.trim()}
                                          >
                                            <Send className="h-3 w-3" />
                                          </Button>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3">
                                          <span className="text-xs text-gray-500">Status:</span>
                                          <Select
                                            defaultValue={ticket.status}
                                            onValueChange={(value) => handleStatusChange(ticket.id, value)}
                                          >
                                            <SelectTrigger className="h-7 text-xs w-32">
                                              <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="To Do">To Do</SelectItem>
                                              <SelectItem value="In Progress">In Progress</SelectItem>
                                              <SelectItem value="Done">Done</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </motion.div>
                                    )}
                                  </div>
                                </Card3D>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                  Drag and drop tickets between columns to change their status or click on a ticket to view details
                </div>
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                <AnimatePresence>
                  {tickets.map((ticket, index) => (
                    <Card3D key={ticket.id} intensity={8} className="rounded-lg">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{ticket.id}</Badge>
                            {editingTicket === ticket.id ? (
                              <Input
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-96"
                              />
                            ) : (
                              <h3 className="font-medium">{ticket.title}</h3>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                            <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                              {ticket.storyPoints} SP
                            </Badge>

                            {editingTicket === ticket.id ? (
                              <Button size="sm" onClick={() => handleSaveEdit(ticket.id)}>
                                Save
                              </Button>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditClick(ticket.id, ticket.title)}>
                                    <Edit className="h-4 w-4 mr-2" /> Edit Title
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "To Do")}>
                                    <Badge variant="outline" className="h-2 w-2 mr-2 bg-gray-200 dark:bg-gray-700" />
                                    Move to To Do
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "In Progress")}>
                                    <Badge variant="outline" className="h-2 w-2 mr-2 bg-blue-200 dark:bg-blue-700" />
                                    Move to In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(ticket.id, "Done")}>
                                    <Badge variant="outline" className="h-2 w-2 mr-2 bg-green-200 dark:bg-green-700" />
                                    Move to Done
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>

                        <div className="mb-3">
                          <Textarea
                            value={ticket.description}
                            className="resize-none bg-gray-50 dark:bg-slate-900 min-h-[80px]"
                            readOnly
                          />
                        </div>

                        <div className="mb-3">
                          <h4 className="text-sm font-medium mb-2">Acceptance Criteria:</h4>
                          <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {ticket.acceptanceCriteria.map((criteria, index) => (
                              <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                              >
                                {criteria}
                              </motion.li>
                            ))}
                          </ul>
                        </div>

                        {/* Dependencies section in list view */}
                        {showDependencies && (
                          <div className="mb-3">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Link2 className="h-4 w-4" /> Dependencies
                            </h4>

                            <div className="grid grid-cols-3 gap-4">
                              {/* Blocks */}
                              <div>
                                <h5 className="text-xs font-medium text-red-600 dark:text-red-400 mb-2">Blocks:</h5>
                                {getTicketDependencies(ticket.id).blocks.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {getTicketDependencies(ticket.id).blocks.map((toId) => (
                                      <Badge
                                        key={`${ticket.id}-blocks-${toId}`}
                                        variant="outline"
                                        className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 flex items-center gap-1"
                                      >
                                        {toId}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 p-0 ml-1"
                                          onClick={() => handleRemoveDependency(ticket.id, toId)}
                                        >
                                          <Link2Off className="h-3 w-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </div>

                              {/* Blocked By */}
                              <div>
                                <h5 className="text-xs font-medium text-orange-600 dark:text-orange-400 mb-2">
                                  Blocked By:
                                </h5>
                                {getTicketDependencies(ticket.id).blockedBy.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {getTicketDependencies(ticket.id).blockedBy.map((fromId) => (
                                      <Badge
                                        key={`${fromId}-blocks-${ticket.id}`}
                                        variant="outline"
                                        className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 flex items-center gap-1"
                                      >
                                        {fromId}
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-4 w-4 p-0 ml-1"
                                          onClick={() => handleRemoveDependency(fromId, ticket.id)}
                                        >
                                          <Link2Off className="h-3 w-3" />
                                        </Button>
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </div>

                              {/* Related To */}
                              <div>
                                <h5 className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
                                  Related To:
                                </h5>
                                {getTicketDependencies(ticket.id).relatesTo.length > 0 ? (
                                  <div className="flex flex-wrap gap-1">
                                    {getTicketDependencies(ticket.id).relatesTo.map((relatedId) => {
                                      // Find the dependency to get the direction
                                      const dep = dependencies.find(
                                        (d) =>
                                          d.type === "relates-to" &&
                                          ((d.from === ticket.id && d.to === relatedId) ||
                                            (d.to === ticket.id && d.from === relatedId)),
                                      )

                                      const fromId = dep?.from || ""
                                      const toId = dep?.to || ""

                                      return (
                                        <Badge
                                          key={`${fromId}-relates-${toId}`}
                                          variant="outline"
                                          className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 flex items-center gap-1"
                                        >
                                          {relatedId}
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 p-0 ml-1"
                                            onClick={() => handleRemoveDependency(fromId, toId)}
                                          >
                                            <Link2Off className="h-3 w-3" />
                                          </Button>
                                        </Badge>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-500">None</span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="secondary">{ticket.type}</Badge>
                          {ticket.linkedItems.map((item) => (
                            <Badge
                              key={item}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            >
                              {item}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Status:</span>
                              <Select
                                defaultValue={ticket.status}
                                onValueChange={(value) => handleStatusChange(ticket.id, value)}
                              >
                                <SelectTrigger className="h-8 w-32">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="To Do">To Do</SelectItem>
                                  <SelectItem value="In Progress">In Progress</SelectItem>
                                  <SelectItem value="Done">Done</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Assignee:</span>
                              <Badge variant="outline" className="bg-gray-50 dark:bg-gray-900">
                                {ticket.assignee}
                              </Badge>
                            </div>
                          </div>

                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" /> Comments
                            </h4>
                            <div className="space-y-3 max-h-60 overflow-y-auto mb-3">
                              {ticket.comments.length > 0 ? (
                                ticket.comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="flex gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-900"
                                  >
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                                      <AvatarFallback>
                                        {comment.author
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="font-medium">{comment.author}</span>
                                        <span className="text-gray-400 text-xs">{formatDate(comment.timestamp)}</span>
                                      </div>
                                      <p className="mt-1 text-sm">{comment.content}</p>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                                  No comments yet. Be the first to comment!
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleAddComment(ticket.id)
                                  }
                                }}
                              />
                              <Button
                                className="shrink-0"
                                onClick={() => handleAddComment(ticket.id)}
                                disabled={!commentText.trim()}
                              >
                                <Send className="h-4 w-4 mr-2" /> Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Card3D>
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
