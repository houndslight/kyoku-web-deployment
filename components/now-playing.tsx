"use client"

import { useState } from "react"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Volume2, VolumeX, Heart, Music } from "lucide-react"
import Image from "next/image"

interface NowPlayingProps {
  track: Track | null
  isPlaying: boolean
  currentTime: number
  volume: number
  repeat: "none" | "one" | "all"
  shuffle: boolean
  isFavorite: boolean
  onTogglePlayPause: () => void
  onNext: () => void
  onPrevious: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onToggleRepeat: () => void
  onToggleShuffle: () => void
  onToggleFavorite: () => void
}

export function NowPlaying({
  track,
  isPlaying,
  currentTime,
  volume,
  repeat,
  shuffle,
  isFavorite,
  onTogglePlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onToggleFavorite,
}: NowPlayingProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleMuteToggle = () => {
    if (isMuted) {
      onVolumeChange(0.5)
      setIsMuted(false)
    } else {
      onVolumeChange(0)
      setIsMuted(true)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    onVolumeChange(newVolume)
    setIsMuted(newVolume === 0)
  }

  if (!track) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No track playing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col items-center justify-center px-8 py-12">
      {/* Album art */}
      <div className="w-full max-w-md aspect-square mb-8 relative">
        {track.coverArt && !imageError ? (
          <Image
            src={track.coverArt || "/placeholder.svg"}
            alt={track.title}
            fill
            className="object-cover rounded-lg shadow-2xl"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center shadow-2xl">
            <Music className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="text-center mb-8 max-w-md w-full">
        <h2 className="text-3xl font-medium mb-2 text-foreground text-balance">{track.title}</h2>
        <p className="text-lg text-muted-foreground">{track.artist}</p>
        {track.album && <p className="text-sm text-muted-foreground mt-1">{track.album}</p>}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-2xl mb-6">
        <Slider
          value={[currentTime]}
          max={track.duration || 100}
          step={0.1}
          onValueChange={(value) => onSeek(value[0])}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleShuffle}
          className={shuffle ? "text-primary" : "text-muted-foreground"}
        >
          <Shuffle className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={onPrevious} className="text-foreground">
          <SkipBack className="h-6 w-6" />
        </Button>

        <Button
          variant="default"
          size="icon"
          onClick={onTogglePlayPause}
          className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" fill="currentColor" />
          ) : (
            <Play className="h-6 w-6" fill="currentColor" />
          )}
        </Button>

        <Button variant="ghost" size="icon" onClick={onNext} className="text-foreground">
          <SkipForward className="h-6 w-6" />
        </Button>

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

      {/* Secondary controls */}
      <div className="flex items-center gap-6 w-full max-w-md">
        <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </Button>

        <div className="flex-1 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleMuteToggle} className="text-muted-foreground">
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider value={[volume]} max={1} step={0.01} onValueChange={handleVolumeChange} className="flex-1" />
        </div>
      </div>
    </div>
  )
}
