"use client"

import { useState } from "react"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Music, Heart } from "lucide-react"
import Image from "next/image"

interface MiniPlayerProps {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  isFavorite: boolean
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onToggleFavorite: () => void
  onExpand: () => void
}

export function MiniPlayer({
  track,
  isPlaying,
  currentTime,
  isFavorite,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onToggleFavorite,
  onExpand,
}: MiniPlayerProps) {
  const [imageError, setImageError] = useState(false)

  if (!track) return null

  const progress = track.duration ? (currentTime / track.duration) * 100 : 0

  return (
    <div className="border-t border-border bg-card hidden md:block">
      {/* Progress bar */}
      <div className="h-1 bg-muted relative">
        <div className="absolute inset-y-0 left-0 bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex items-center gap-4 px-4 py-3">
        {/* Track info */}
        <button
          onClick={onExpand}
          className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-12 h-12 flex-shrink-0 relative">
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
          </div>

          <div className="flex-1 min-w-0 text-left">
            <div className="font-medium text-sm truncate text-foreground">{track.title}</div>
            <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
          </div>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onToggleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-10 w-10" onClick={onTogglePlayPause}>
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5" fill="currentColor" />
            )}
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
