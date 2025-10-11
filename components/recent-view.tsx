"use client"

import type { Track } from "@/lib/types"
import { TrackListItem } from "./track-list-item"
import { Clock } from "lucide-react"

interface RecentViewProps {
  tracks: Track[]
  recentlyPlayed: string[]
  currentTrack: Track | null
  isPlaying: boolean
  favorites: string[]
  onPlayTrack: (track: Track, trackList: Track[]) => void
  onToggleFavorite: (trackId: string) => void
  onRemoveTrack: (trackId: string) => void
  onEditTrack: (track: Track) => void
}

export function RecentView({
  tracks,
  recentlyPlayed,
  currentTrack,
  isPlaying,
  favorites,
  onPlayTrack,
  onToggleFavorite,
  onRemoveTrack,
  onEditTrack,
}: RecentViewProps) {
  const recentTracks = recentlyPlayed
    .map((id) => tracks.find((t) => t.id === id))
    .filter((track): track is Track => track !== undefined)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-4 md:px-6 py-3 md:py-4">
        <h1 className="text-xl md:text-2xl font-medium text-foreground">Recently Played</h1>
        <p className="text-sm text-muted-foreground mt-1">{recentTracks.length} tracks</p>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {recentTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <div className="text-muted-foreground">No recently played tracks</div>
            <div className="text-sm text-muted-foreground mt-2">Your listening history will appear here</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentTracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                isPlaying={isPlaying}
                isCurrent={currentTrack?.id === track.id}
                isFavorite={favorites.includes(track.id)}
                onPlay={() => onPlayTrack(track, recentTracks)}
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
