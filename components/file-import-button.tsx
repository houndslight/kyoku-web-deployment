"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FolderOpen } from "lucide-react"

interface FileImportButtonProps {
  onImport: (files: FileList) => void
  isLoading?: boolean
}

export function FileImportButton({ onImport, isLoading }: FileImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFolderClick = () => {
    folderInputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      onImport(files)
    }
    // Reset input
    if (e.target === fileInputRef.current && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    if (e.target === folderInputRef.current && folderInputRef.current) {
      folderInputRef.current.value = ""
    }
  }

  return (
    <div className="flex gap-2">
      <input ref={fileInputRef} type="file" accept="audio/*" multiple onChange={handleChange} className="hidden" />

      <input
        ref={folderInputRef}
        type="file"
        accept="audio/*"
        // @ts-ignore - webkitdirectory is not in TypeScript types but works in browsers
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleChange}
        className="hidden"
      />

      <Button onClick={handleFileClick} disabled={isLoading} variant="outline" size="sm">
        <Upload className="h-4 w-4 mr-2" />
        {isLoading ? "Importing..." : "Import Files"}
      </Button>

      <Button onClick={handleFolderClick} disabled={isLoading} variant="outline" size="sm">
        <FolderOpen className="h-4 w-4 mr-2" />
        Import Folder
      </Button>
    </div>
  )
}
