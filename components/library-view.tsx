"use client"

import type React from "react"

import { useState, useMemo } from "react"
import type { Track } from "@/lib/types"
import { TrackListItem } from "./track-list-item"
import { FileImportButton } from "./file-import-button"
import { Input } from "@/components/ui/input"
import { Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LibraryViewProps {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  favorites: string[]
  isLoading: boolean
  onImport: (files: FileList) => void
  onPlayTrack: (track: Track, trackList: Track[]) => void
  onToggleFavorite: (trackId: string) => void
  onRemoveTrack: (trackId: string) => void
  onEditTrack: (track: Track) => void
}

export function LibraryView({
  tracks,
  currentTrack,
  isPlaying,
  favorites,
  isLoading,
  onImport,
  onPlayTrack,
  onToggleFavorite,
  onRemoveTrack,
  onEditTrack,
}: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"title" | "artist" | "album" | "recent">("recent")
  const [isDragging, setIsDragging] = useState(false)

  const filteredAndSortedTracks = useMemo(() => {
    let filtered = tracks

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = tracks.filter(
        (track) =>
          track.title.toLowerCase().includes(query) ||
          track.artist.toLowerCase().includes(query) ||
          track.album.toLowerCase().includes(query),
      )
    }

    // Sort
    const sorted = [...filtered]
    switch (sortBy) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "artist":
        sorted.sort((a, b) => a.artist.localeCompare(b.artist))
        break
      case "album":
        sorted.sort((a, b) => a.album.localeCompare(b.album))
        break
      case "recent":
        sorted.sort((a, b) => b.addedAt - a.addedAt)
        break
    }

    return sorted
  }, [tracks, searchQuery, sortBy])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Filter for audio files only
      const audioFiles = Array.from(files).filter((file) => file.type.startsWith("audio/"))
      if (audioFiles.length > 0) {
        const dataTransfer = new DataTransfer()
        audioFiles.forEach((file) => dataTransfer.items.add(file))
        onImport(dataTransfer.files)
      }
    }
  }

  return (
    <div
      className="flex flex-col h-full relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-primary/10 backdrop-blur-sm border-4 border-dashed border-primary rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Upload className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-xl font-medium text-primary">Drop audio files or folders here</p>
            <p className="text-sm text-muted-foreground mt-2">Import your music library</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <h1 className="text-xl md:text-2xl font-medium text-foreground">Library</h1>
          <FileImportButton onImport={onImport} isLoading={isLoading} />
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists, albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            <Button
              variant={sortBy === "recent" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("recent")}
              className="flex-shrink-0"
            >
              Recent
            </Button>
            <Button
              variant={sortBy === "title" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("title")}
              className="flex-shrink-0"
            >
              Title
            </Button>
            <Button
              variant={sortBy === "artist" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("artist")}
              className="flex-shrink-0"
            >
              Artist
            </Button>
            <Button
              variant={sortBy === "album" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSortBy("album")}
              className="flex-shrink-0"
            >
              Album
            </Button>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {filteredAndSortedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="text-muted-foreground mb-4">
              {tracks.length === 0 ? "No tracks in your library" : "No tracks found"}
            </div>
            {tracks.length === 0 && (
              <div className="space-y-3">
                <FileImportButton onImport={onImport} isLoading={isLoading} />
                <p className="text-sm text-muted-foreground">or drag and drop files/folders here</p>
              </div>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAndSortedTracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                isPlaying={isPlaying}
                isCurrent={currentTrack?.id === track.id}
                isFavorite={favorites.includes(track.id)}
                onPlay={() => onPlayTrack(track, filteredAndSortedTracks)}
                onToggleFavorite={() => onToggleFavorite(track.id)}
                onRemove={() => onRemoveTrack(track.id)}
                onEdit={() => onEditTrack(track)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
