"use client"

import { useState } from "react"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Play, Pause, Music } from "lucide-react"
import Image from "next/image"

interface MobileMiniPlayerProps {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  onTogglePlayPause: () => void
  onExpand: () => void
}

export function MobileMiniPlayer({
  track,
  isPlaying,
  currentTime,
  onTogglePlayPause,
  onExpand,
}: MobileMiniPlayerProps) {
  const [imageError, setImageError] = useState(false)

  if (!track) return null

  const progress = track.duration ? (currentTime / track.duration) * 100 : 0

  return (
    <div className="md:hidden border-t border-border bg-card safe-area-inset-bottom">
      {/* Progress bar */}
      <div className="h-0.5 bg-muted relative">
        <div className="absolute inset-y-0 left-0 bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>

      <button
        onClick={onExpand}
        className="flex items-center gap-3 px-4 py-2 w-full hover:bg-accent/50 transition-colors"
      >
        {/* Cover art */}
        <div className="w-10 h-10 flex-shrink-0 relative">
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
              <Music className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Track info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="font-medium text-sm truncate text-foreground">{track.title}</div>
          <div className="text-xs text-muted-foreground truncate">{track.artist}</div>
        </div>

        {/* Play/Pause button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation()
            onTogglePlayPause()
          }}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5" fill="currentColor" />
          )}
        </Button>
      </button>
    </div>
  )
}
