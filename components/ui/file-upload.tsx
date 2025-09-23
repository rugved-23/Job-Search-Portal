"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, type File, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  accept?: string
  maxSize?: number // in MB
  currentFile?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = ".pdf,.doc,.docx",
  maxSize = 5,
  currentFile,
  className,
  disabled = false,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const handleFileSelection = async (file: File) => {
    setError(null)

    // Validate file type
    const allowedTypes = accept.split(",").map((type) => type.trim())
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      setError(`File type not supported. Please upload: ${accept}`)
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`)
      return
    }

    // Simulate upload progress
    setUploading(true)
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          onFileSelect(file)
          return 100
        }
        return prev + 10
      })
    }, 100)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFileSelection(files[0])
    }
  }

  const openFileDialog = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (currentFile && !uploading) {
    return (
      <Card className={cn("border-2", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-sm">Resume uploaded</p>
                <p className="text-xs text-muted-foreground">{currentFile.split("/").pop() || "resume.pdf"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={openFileDialog} disabled={disabled}>
                Replace
              </Button>
              {onFileRemove && (
                <Button variant="ghost" size="sm" onClick={onFileRemove} disabled={disabled}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={className}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-8">
          {uploading ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-primary/10 rounded-full w-fit mx-auto">
                <Upload className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <p className="font-medium">Uploading...</p>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={cn("p-3 rounded-full w-fit mx-auto", error ? "bg-destructive/10" : "bg-primary/10")}>
                {error ? (
                  <AlertCircle className="h-6 w-6 text-destructive" />
                ) : (
                  <Upload className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="space-y-2">
                <p className="font-medium">{error ? "Upload Error" : "Upload your resume"}</p>
                <p className="text-sm text-muted-foreground">
                  {error || `Drag and drop or click to browse (${accept}, max ${maxSize}MB)`}
                </p>
                {!error && (
                  <Button variant="outline" size="sm" disabled={disabled}>
                    Choose File
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />
    </div>
  )
}
