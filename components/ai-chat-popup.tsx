"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hi there! I'm your AI assistant. How can I help you refine your requirements or Jira tickets?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    // Show the chat button after a delay
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")
    setIsTyping(true)

    // Simulate AI response after a short delay
    setTimeout(() => {
      let response = ""

      if (input.toLowerCase().includes("story point")) {
        response =
          "Story points are estimated based on complexity, effort, and historical data. I analyze similar tasks from your past projects to provide accurate estimations."
      } else if (input.toLowerCase().includes("developer") || input.toLowerCase().includes("assign")) {
        response =
          "Developers are assigned based on their skills, current workload, and past performance on similar tasks. I try to balance the team workload while matching the right skills to each task."
      } else if (input.toLowerCase().includes("jira") || input.toLowerCase().includes("ticket")) {
        response =
          "I create Jira tickets by extracting user stories, acceptance criteria, and requirements from your BRD. Each ticket is structured with a clear title, description, and linked to its parent epic."
      } else {
        response =
          "I can help you refine requirements, adjust story points, reassign developers, or modify Jira tickets. What specific aspect would you like to improve?"
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "bot", content: response }])
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 group relative"
              onClick={() => setIsOpen(true)}
            >
              <span className="absolute -top-2 -right-2 flex h-5 w-5 animate-bounce">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-purple-500 items-center justify-center text-[10px] text-white font-bold">
                  AI
                </span>
              </span>
              <Bot className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              <span className="absolute inset-0 rounded-full border-4 border-blue-300 dark:border-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="w-80 sm:w-96 h-96 shadow-2xl flex flex-col border-blue-200 dark:border-blue-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
              <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">AI Assistant</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ask about your requirements</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors duration-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="flex-1 overflow-auto p-3 space-y-4">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                            : "bg-gray-100 dark:bg-slate-800"
                        }`}
                      >
                        {message.content}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-slate-800 flex items-center gap-2">
                        <span className="text-xs text-gray-500">AI is typing</span>
                        <div className="flex gap-1">
                          <span
                            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></span>
                          <span
                            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></span>
                          <span
                            className="h-1.5 w-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </CardContent>

              <CardFooter className="p-3 pt-0">
                <div className="flex w-full items-center gap-2">
                  <Input
                    placeholder="Ask about your requirements..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 border-blue-200 dark:border-blue-800 focus-visible:ring-blue-500"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group"
                  >
                    <Send className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
