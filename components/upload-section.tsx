"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpIcon, Upload, FileType, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function UploadSection() {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsUploading(false)

          // Show loading section
          document.querySelector('[data-section="loading"]')?.classList.remove("hidden")

          // Scroll to loading section
          document.getElementById("loading")?.scrollIntoView({ behavior: "smooth" })

          // Simulate AI processing
          setTimeout(() => {
            document.querySelector('[data-section="loading"]')?.classList.add("hidden")
            document.querySelector('[data-section="extraction"]')?.classList.remove("hidden")
            document.getElementById("extraction")?.scrollIntoView({ behavior: "smooth" })

            // Show next sections with delays to simulate processing
            setTimeout(() => {
              document.querySelector('[data-section="jira-preview"]')?.classList.remove("hidden")
              document.getElementById("jira-preview")?.scrollIntoView({ behavior: "smooth" })
            }, 2000)

            setTimeout(() => {
              document.querySelector('[data-section="developer-assignment"]')?.classList.remove("hidden")
              document.getElementById("developer-assignment")?.scrollIntoView({ behavior: "smooth" })
            }, 4000)

            setTimeout(() => {
              document.querySelector('[data-section="story-point"]')?.classList.remove("hidden")
              document.getElementById("story-point")?.scrollIntoView({ behavior: "smooth" })
            }, 6000)
          }, 3000)
        }, 500)
      }
    }, 50)
  }

  const handleSampleBRD = () => {
    setSelectedFile(new File(["sample"], "sample-brd.pdf", { type: "application/pdf" }))
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full max-w-4xl mx-auto overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <CardTitle className="text-2xl flex items-center gap-2">
            <span className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </span>
            Upload Business Requirement Document
          </CardTitle>
          <CardDescription>
            Upload your BRD file (PDF or DOCX) to extract requirements and convert them into Jira tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center relative overflow-hidden transition-all duration-300 ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 scale-[0.99]"
                : "border-gray-300 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <AnimatePresence mode="wait">
              {isUploading ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="relative h-20 w-20">
                    <svg className="h-20 w-20" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 dark:text-gray-700"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                      />
                      <circle
                        className="text-blue-600 dark:text-blue-400"
                        strokeWidth="8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (uploadProgress / 100) * 264}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{uploadProgress}%</span>
                    </div>
                  </div>
                  <p className="text-blue-600 dark:text-blue-400 animate-pulse">Uploading {selectedFile?.name}...</p>
                </motion.div>
              ) : selectedFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileType className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="mt-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Remove
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center animate-bounce">
                    <FileUpIcon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Drag & Drop your BRD file here</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports PDF, DOCX, TXT formats</p>
                  </div>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      onClick={handleBrowseClick}
                      className="group hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300"
                    >
                      <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Browse Files
                      </span>
                      <input
                        ref={fileInputRef}
                        id="file-upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
          <Button
            variant="outline"
            onClick={handleSampleBRD}
            className="relative overflow-hidden group hover:border-blue-500 transition-all duration-300"
            disabled={isUploading}
          >
            <span className="relative z-10 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              Use Sample BRD
            </span>
            <span className="absolute inset-0 w-0 bg-blue-100 dark:bg-blue-900/20 group-hover:w-full transition-all duration-300 z-0"></span>
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            <span className="relative z-10">{isUploading ? "Uploading..." : "Process with AI"}</span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/20 group-hover:h-full transition-all duration-300 z-0"></span>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
