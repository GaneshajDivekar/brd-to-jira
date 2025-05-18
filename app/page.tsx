"use client"

import { Suspense, useEffect } from "react"
import UploadSection from "@/components/upload-section"
import ExtractionResults from "@/components/extraction-results"
import JiraTicketPreview from "@/components/jira-ticket-preview"
import DeveloperAssignment from "@/components/developer-assignment"
import StoryPointEstimation from "@/components/story-point-estimation"
import AIChatPopup from "@/components/ai-chat-popup"
import LoadingSimulation from "@/components/loading-simulation"
import { Button } from "@/components/ui/button"
import AnimatedBackground from "@/components/animated-background"
import FloatingIcons from "@/components/floating-icons"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  // Add global error handler for ResizeObserver
  useEffect(() => {
    // Suppress ResizeObserver loop error
    const errorHandler = (e: ErrorEvent) => {
      if (e.message.includes("ResizeObserver") || e.error?.message.includes("ResizeObserver")) {
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 overflow-hidden relative">
      <AnimatedBackground />
      <FloatingIcons />

      <header className="bg-white/80 dark:bg-slate-950/80 shadow-sm backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 dark:shadow-blue-500/10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-white animate-pulse"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  BRD
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">2</span>
                  Jira
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">AI-Powered Requirements Transformation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                className="group transition-all duration-300 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400"
              >
                <span className="mr-2 group-hover:-translate-y-1 transition-transform duration-300">📄</span>
                Documentation
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/20"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <section id="upload" className="mb-16 animate-fadeIn">
          <UploadSection />
        </section>

        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
          <section id="loading" className="mb-16 hidden animate-slideUp" data-section="loading">
            <LoadingSimulation />
          </section>

          <section id="extraction" className="mb-16 hidden animate-slideUp" data-section="extraction">
            <ExtractionResults />
          </section>

          <section id="jira-preview" className="mb-16 hidden animate-slideUp" data-section="jira-preview">
            <JiraTicketPreview />
          </section>

          <section
            id="developer-assignment"
            className="mb-16 hidden animate-slideUp"
            data-section="developer-assignment"
          >
            <DeveloperAssignment />
          </section>

          <section id="story-point" className="mb-16 hidden animate-slideUp" data-section="story-point">
            <StoryPointEstimation />
          </section>
        </Suspense>
      </main>

      <footer className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-4 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-sm text-slate-500 dark:text-slate-400">© 2025 BRD2Jira. All rights reserved.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powered by Ganesh Divekar
              </span>
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                <span className="text-xs text-white font-bold">GD</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <AIChatPopup />
    </div>
  )
}
