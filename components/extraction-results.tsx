"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Users } from "lucide-react"
import { motion } from "framer-motion"
import Card3D from "@/components/card-3d"

const mockExtractedData = {
  epics: [
    {
      id: "EP-1",
      title: "User Authentication System",
      description: "Implement a secure authentication system for the application",
      features: 4,
      stories: 12,
    },
    {
      id: "EP-2",
      title: "Dashboard Analytics",
      description: "Create a comprehensive analytics dashboard for user insights",
      features: 3,
      stories: 8,
    },
  ],
  features: [
    {
      id: "FT-1",
      epicId: "EP-1",
      title: "User Registration",
      description: "Allow users to register with email or social accounts",
      stories: 3,
    },
    {
      id: "FT-2",
      epicId: "EP-1",
      title: "Login System",
      description: "Secure login with multi-factor authentication",
      stories: 4,
    },
    {
      id: "FT-3",
      epicId: "EP-1",
      title: "Password Management",
      description: "Password reset and update functionality",
      stories: 3,
    },
    {
      id: "FT-4",
      epicId: "EP-1",
      title: "User Profile",
      description: "User profile management and settings",
      stories: 2,
    },
    {
      id: "FT-5",
      epicId: "EP-2",
      title: "User Activity Metrics",
      description: "Track and display user activity metrics",
      stories: 3,
    },
    {
      id: "FT-6",
      epicId: "EP-2",
      title: "Data Visualization",
      description: "Interactive charts and graphs for data visualization",
      stories: 3,
    },
    {
      id: "FT-7",
      epicId: "EP-2",
      title: "Report Generation",
      description: "Generate and export reports in various formats",
      stories: 2,
    },
  ],
  stories: [
    {
      id: "US-1",
      featureId: "FT-1",
      title: "Email Registration",
      description: "As a user, I want to register with my email address",
      acceptanceCriteria: [
        "User can enter email, password, and name",
        "System validates email format",
        "System checks for duplicate emails",
        "User receives confirmation email",
      ],
      complexity: "Medium",
    },
    {
      id: "US-2",
      featureId: "FT-1",
      title: "Social Media Registration",
      description: "As a user, I want to register using my social media accounts",
      acceptanceCriteria: [
        "User can click on social media icons",
        "System redirects to OAuth flow",
        "System creates account with social profile data",
        "User is redirected back to the application",
      ],
      complexity: "High",
    },
    // More stories would be here in a real implementation
  ],
}

export default function ExtractionResults() {
  const [activeTab, setActiveTab] = useState("epics")
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Highlight random items periodically for visual effect
  useEffect(() => {
    const interval = setInterval(() => {
      const items =
        activeTab === "epics"
          ? mockExtractedData.epics
          : activeTab === "features"
            ? mockExtractedData.features
            : mockExtractedData.stories

      if (items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length)
        const randomItem = items[randomIndex]
        setHighlightedItem(randomItem.id)

        // Clear highlight after a short delay
        setTimeout(() => {
          setHighlightedItem(null)
        }, 1000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [activeTab])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 dark:shadow-green-500/10">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI Extraction Results</CardTitle>
              <CardDescription>We've analyzed your BRD and extracted the following requirements</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6" ref={containerRef}>
          <Tabs defaultValue="epics" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-slate-100 dark:bg-slate-800/50">
              <TabsTrigger
                value="epics"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                <span>Epics ({mockExtractedData.epics.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                <FileText className="h-4 w-4" />
                <span>Features ({mockExtractedData.features.length})</span>
              </TabsTrigger>
              <TabsTrigger
                value="stories"
                className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-950 data-[state=active]:shadow-md transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                <span>User Stories ({mockExtractedData.stories.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="epics" className="space-y-4">
              {mockExtractedData.epics.map((epic) => (
                <Card3D key={epic.id} intensity={6} className="rounded-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border rounded-lg p-4 hover:border-green-200 dark:hover:border-green-800 transition-all duration-300 ${
                      highlightedItem === epic.id
                        ? "border-green-500 dark:border-green-500 bg-green-50 dark:bg-green-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                        >
                          {epic.id}
                        </Badge>
                        {epic.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge variant="secondary" className="animate-pulse">
                          {epic.features} Features
                        </Badge>
                        <Badge variant="secondary" className="animate-pulse">
                          {epic.stories} Stories
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{epic.description}</p>
                  </motion.div>
                </Card3D>
              ))}
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              {mockExtractedData.features.map((feature, index) => (
                <Card3D key={feature.id} intensity={6} className="rounded-lg">
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border rounded-lg p-4 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 ${
                      highlightedItem === feature.id
                        ? "border-blue-500 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        >
                          {feature.id}
                        </Badge>
                        {feature.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                        >
                          {feature.epicId}
                        </Badge>
                        <Badge variant="secondary" className="animate-pulse">
                          {feature.stories} Stories
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </motion.div>
                </Card3D>
              ))}
            </TabsContent>

            <TabsContent value="stories" className="space-y-4">
              {mockExtractedData.stories.map((story, index) => (
                <Card3D key={story.id} intensity={6} className="rounded-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`border rounded-lg p-4 hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-300 ${
                      highlightedItem === story.id
                        ? "border-purple-500 dark:border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                        >
                          {story.id}
                        </Badge>
                        {story.title}
                      </h3>
                      <div className="flex gap-2">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        >
                          {story.featureId}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={
                            story.complexity === "Low"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200 dark:border-green-800"
                              : story.complexity === "Medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200 dark:border-red-800"
                          }
                        >
                          {story.complexity} Complexity
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">{story.description}</p>

                    <div className="mt-2">
                      <h4 className="text-sm font-medium mb-2">Acceptance Criteria:</h4>
                      <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {story.acceptanceCriteria.map((criteria, index) => (
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
                  </motion.div>
                </Card3D>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
