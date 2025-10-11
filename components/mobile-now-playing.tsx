"use client"

import { useState } from "react"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Heart,
  Music,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react"
import Image from "next/image"

interface MobileNowPlayingProps {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  repeat: "none" | "one" | "all"
  shuffle: boolean
  isFavorite: boolean
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onToggleRepeat: () => void
  onToggleShuffle: () => void
  onToggleFavorite: () => void
  onClose: () => void
}

export function MobileNowPlaying({
  track,
  isPlaying,
  currentTime,
  repeat,
  shuffle,
  isFavorite,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onToggleRepeat,
  onToggleShuffle,
  onToggleFavorite,
  onClose,
}: MobileNowPlayingProps) {
  const [imageError, setImageError] = useState(false)

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!track) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No track playing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col safe-area-inset">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 safe-area-inset-top">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronDown className="h-6 w-6" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Playing from Library</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-6 w-6" />
        </Button>
      </div>

      {/* Album art */}
      <div className="flex-1 flex items-center justify-center px-6 py-4">
        <div className="w-full max-w-sm aspect-square relative">
          {track.coverArt && !imageError ? (
            <Image
              src={track.coverArt || "/placeholder.svg"}
              alt={track.title}
              fill
              className="object-cover rounded-2xl shadow-2xl"
              onError={() => setImageError(true)}
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center shadow-2xl">
              <Music className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      {/* Track info and controls */}
      <div className="px-6 pb-8 space-y-4">
        {/* Track info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground truncate">{track.title}</h2>
            <p className="text-lg text-muted-foreground truncate">{track.artist}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleFavorite} className="flex-shrink-0">
            <Heart className={`h-6 w-6 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            max={track.duration || 100}
            step={0.1}
            onValueChange={(value) => onSeek(value[0])}
          />
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleShuffle}
            className={shuffle ? "text-primary" : "text-muted-foreground"}
          >
            <Shuffle className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={onPrevious} className="h-12 w-12">
              <SkipBack className="h-7 w-7" />
            </Button>

            <Button
              variant="default"
              size="icon"
              onClick={onTogglePlayPause}
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="h-7 w-7" fill="currentColor" />
              ) : (
                <Play className="h-7 w-7 ml-1" fill="currentColor" />
              )}
            </Button>

            <Button variant="ghost" size="icon" onClick={onNext} className="h-12 w-12">
              <SkipForward className="h-7 w-7" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRepeat}
            className={repeat !== "none" ? "text-primary" : "text-muted-foreground"}
          >
            <Repeat className="h-5 w-5" />
            {repeat === "one" && <span className="absolute text-[10px] font-bold">1</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
