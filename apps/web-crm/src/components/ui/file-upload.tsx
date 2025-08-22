"use client"

import * as React from "react"
import { Upload, X, File, Image, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  maxFiles?: number
  onFileSelect?: (files: File[]) => void
  onFileRemove?: (index: number) => void
  className?: string
  disabled?: boolean
  showPreview?: boolean
  variant?: "default" | "button" | "avatar"
}

interface UploadedFile extends File {
  id: string
  preview?: string
  progress?: number
  error?: string
}

export function FileUpload({
  accept = "*/*",
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onFileSelect,
  onFileRemove,
  className,
  disabled = false,
  showPreview = true,
  variant = "default"
}: FileUploadProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const validateFile = (file: File): string | undefined => {
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }
    return undefined
  }

  const processFiles = (fileList: FileList) => {
    const newFiles: UploadedFile[] = []

    Array.from(fileList).forEach((file) => {
      const error = validateFile(file)
      const uploadedFile: UploadedFile = Object.assign(file, {
        id: generateId(),
        error,
        progress: 0
      })

      // Generate preview for images
      if (file.type.startsWith('image/') && showPreview) {
        const reader = new FileReader()
        reader.onload = () => {
          uploadedFile.preview = reader.result as string
          setFiles(prev => [...prev])
        }
        reader.readAsDataURL(file)
      }

      newFiles.push(uploadedFile)
    })

    const totalFiles = files.length + newFiles.length
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    setFiles(prev => [...prev, ...newFiles])
    onFileSelect?.(newFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (disabled) return
    
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    onFileRemove?.(index)
  }

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-6 w-6" />
    if (file.type.includes('pdf')) return <FileText className="h-6 w-6" />
    return <File className="h-6 w-6" />
  }

  if (variant === "button") {
    return (
      <div className={className}>
        <Button
          type="button"
          variant="outline"
          onClick={openFileDialog}
          disabled={disabled}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  if (variant === "avatar") {
    return (
      <div className={cn("relative", className)}>
        <div
          onClick={openFileDialog}
          className="relative w-24 h-24 border-2 border-dashed border-muted-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-muted transition-colors"
        >
          {files[0]?.preview ? (
            <img
              src={files[0].preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground hover:border-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">
          Drop files here, or <span className="text-primary">browse</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {accept === "*/*" ? "Any file type" : `Accepts: ${accept}`} • 
          Max {Math.round(maxSize / 1024 / 1024)}MB • 
          {multiple ? `Up to ${maxFiles} files` : "Single file"}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 border rounded-lg"
            >
              {/* File Icon/Preview */}
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="text-muted-foreground">
                    {getFileIcon(file)}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                {file.error && (
                  <p className="text-xs text-red-600">{file.error}</p>
                )}
                {file.progress !== undefined && file.progress < 100 && (
                  <Progress value={file.progress} className="mt-1" />
                )}
              </div>

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}