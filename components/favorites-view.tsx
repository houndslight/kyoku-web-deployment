"use client"

import type { Track } from "@/lib/types"
import { TrackListItem } from "./track-list-item"
import { Heart } from "lucide-react"

interface FavoritesViewProps {
  tracks: Track[]
  currentTrack: Track | null
  isPlaying: boolean
  favorites: string[]
  onPlayTrack: (track: Track, trackList: Track[]) => void
  onToggleFavorite: (trackId: string) => void
  onRemoveTrack: (trackId: string) => void
  onEditTrack: (track: Track) => void
}

export function FavoritesView({
  tracks,
  currentTrack,
  isPlaying,
  favorites,
  onPlayTrack,
  onToggleFavorite,
  onRemoveTrack,
  onEditTrack,
}: FavoritesViewProps) {
  const favoriteTracks = tracks.filter((track) => favorites.includes(track.id))

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border px-4 md:px-6 py-3 md:py-4">
        <h1 className="text-xl md:text-2xl font-medium text-foreground">Favorites</h1>
        <p className="text-sm text-muted-foreground mt-1">{favoriteTracks.length} tracks</p>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {favoriteTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <div className="text-muted-foreground">No favorite tracks yet</div>
            <div className="text-sm text-muted-foreground mt-2">
              Click the heart icon on any track to add it to your favorites
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {favoriteTracks.map((track) => (
              <TrackListItem
                key={track.id}
                track={track}
                isPlaying={isPlaying}
                isCurrent={currentTrack?.id === track.id}
                isFavorite={true}
                onPlay={() => onPlayTrack(track, favoriteTracks)}
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
