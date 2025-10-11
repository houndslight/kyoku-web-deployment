"use client"

import { useState } from "react"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause, Heart, MoreVertical, Music } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface TrackListItemProps {
  track: Track
  isPlaying: boolean
  isCurrent: boolean
  isFavorite: boolean
  onPlay: () => void
  onToggleFavorite: () => void
  onRemove: () => void
  onEdit: () => void
}

export function TrackListItem({
  track,
  isPlaying,
  isCurrent,
  isFavorite,
  onPlay,
  onToggleFavorite,
  onRemove,
  onEdit,
}: TrackListItemProps) {
  const [imageError, setImageError] = useState(false)

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div
      className={`group flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 hover:bg-accent/50 transition-colors ${
        isCurrent ? "bg-accent" : ""
      }`}
    >
      {/* Play button and cover art */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {track.coverArt && !imageError ? (
          <Image
            src={track.coverArt || "/placeholder.svg"}
            alt={track.title}
            fill
            className="object-cover rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
            <Music className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <button
          onClick={onPlay}
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded"
        >
          {isPlaying && isCurrent ? (
            <Pause className="h-5 w-5 text-white" fill="white" />
          ) : (
            <Play className="h-5 w-5 text-white" fill="white" />
          )}
        </button>
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate text-foreground">{track.title}</div>
        <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
      </div>

      {/* Album - hidden on mobile */}
      <div className="hidden md:block flex-1 min-w-0">
        <div className="text-sm text-muted-foreground truncate">{track.album}</div>
      </div>

      {/* Duration - hidden on small mobile */}
      <div className="hidden sm:block text-sm text-muted-foreground tabular-nums">{formatDuration(track.duration)}</div>

      {/* Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggleFavorite}>
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Edit Info</DropdownMenuItem>
            <DropdownMenuItem onClick={onRemove} className="text-destructive">
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
