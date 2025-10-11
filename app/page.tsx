"use client"

import { useState } from "react"
import { useMusicLibrary } from "@/hooks/use-music-library"
import { useAudioPlayer } from "@/hooks/use-audio-player"
import { Sidebar } from "@/components/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { LibraryView } from "@/components/library-view"
import { FavoritesView } from "@/components/favorites-view"
import { RecentView } from "@/components/recent-view"
import { NowPlaying } from "@/components/now-playing"
import { MobileNowPlaying } from "@/components/mobile-now-playing"
import { MiniPlayer } from "@/components/mini-player"
import { MobileMiniPlayer } from "@/components/mobile-mini-player"
import { EditTrackDialog } from "@/components/edit-track-dialog"
import { ThemeCustomizerButton } from "@/components/theme-customizer"
import { DeveloperCredit } from "@/components/developer-credit"
import type { Track } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2, Download } from "lucide-react"

type View = "library" | "favorites" | "recent" | "playlists" | "now-playing"

export default function MusicPlayer() {
  const { library, isLoading, importFiles, removeTrack, updateTrack, toggleFavorite } = useMusicLibrary()

  const {
    playbackState,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = useAudioPlayer()

  const [activeView, setActiveView] = useState<View>("library")
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [showMobileNowPlaying, setShowMobileNowPlaying] = useState(false)

  const handleImport = async (files: FileList) => {
    await importFiles(files)
  }

  const handleEditTrack = (track: Track) => {
    setEditingTrack(track)
    setIsEditDialogOpen(true)
  }

  const handleSaveTrack = (trackId: string, updates: Partial<Track>) => {
    updateTrack(trackId, updates)
  }

  const handleToggleFavorite = (trackId: string) => {
    toggleFavorite(trackId)
  }

  const isFavorite = (trackId: string) => {
    return library.favorites.includes(trackId)
  }

  const handleViewChange = (view: View) => {
    setActiveView(view)
  }

  const handleExpandPlayer = () => {
    if (window.innerWidth < 768) {
      setShowMobileNowPlaying(true)
    } else {
      setActiveView("now-playing")
    }
  }

  const handleCloseMobileNowPlaying = () => {
    setShowMobileNowPlaying(false)
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex">
          <Sidebar
            activeView={activeView === "now-playing" ? "library" : activeView}
            onViewChange={handleViewChange}
            trackCount={library.tracks.length}
            favoriteCount={library.favorites.length}
          />
        </div>

        {/* Main view */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with theme button */}
          <div
            className={`flex-shrink-0 border-b border-border px-4 py-2 flex items-center justify-between md:justify-end gap-2 ${activeView === "now-playing" ? "hidden md:flex" : ""}`}
          >
            <h1 className="text-lg font-medium md:hidden">Kyoku 曲</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                className="hidden md:flex items-center gap-1.5"
                asChild
              >
                <a href="https://github.com/houndslight/Kyoku" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download Now
                </a>
              </Button>
              <ThemeCustomizerButton />
              {activeView === "now-playing" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setActiveView("library")}
                  title="Show library"
                  className="hidden md:flex"
                >
                  <Minimize2 className="h-5 w-5" />
                </Button>
              )}
              {activeView !== "now-playing" && playbackState.currentTrack && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExpandPlayer}
                  title="Expand player"
                  className="hidden md:flex"
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden pb-0 md:pb-0">
            {activeView === "library" && (
              <LibraryView
                tracks={library.tracks}
                currentTrack={playbackState.currentTrack}
                isPlaying={playbackState.isPlaying}
                favorites={library.favorites}
                isLoading={isLoading}
                onImport={handleImport}
                onPlayTrack={playTrack}
                onToggleFavorite={handleToggleFavorite}
                onRemoveTrack={removeTrack}
                onEditTrack={handleEditTrack}
              />
            )}

            {activeView === "favorites" && (
              <FavoritesView
                tracks={library.tracks}
                currentTrack={playbackState.currentTrack}
                isPlaying={playbackState.isPlaying}
                favorites={library.favorites}
                onPlayTrack={playTrack}
                onToggleFavorite={handleToggleFavorite}
                onRemoveTrack={removeTrack}
                onEditTrack={handleEditTrack}
              />
            )}

            {activeView === "recent" && (
              <RecentView
                tracks={library.tracks}
                recentlyPlayed={library.recentlyPlayed}
                currentTrack={playbackState.currentTrack}
                isPlaying={playbackState.isPlaying}
                favorites={library.favorites}
                onPlayTrack={playTrack}
                onToggleFavorite={handleToggleFavorite}
                onRemoveTrack={removeTrack}
                onEditTrack={handleEditTrack}
              />
            )}

            {/* Desktop now playing - hidden on mobile */}
            {activeView === "now-playing" && (
              <div className="hidden md:block h-full">
                <NowPlaying
                  track={playbackState.currentTrack}
                  isPlaying={playbackState.isPlaying}
                  currentTime={playbackState.currentTime}
                  volume={playbackState.volume}
                  repeat={playbackState.repeat}
                  shuffle={playbackState.shuffle}
                  isFavorite={playbackState.currentTrack ? isFavorite(playbackState.currentTrack.id) : false}
                  onTogglePlayPause={togglePlayPause}
                  onNext={playNext}
                  onPrevious={playPrevious}
                  onSeek={seek}
                  onVolumeChange={setVolume}
                  onToggleRepeat={toggleRepeat}
                  onToggleShuffle={toggleShuffle}
                  onToggleFavorite={() => {
                    if (playbackState.currentTrack) {
                      handleToggleFavorite(playbackState.currentTrack.id)
                    }
                  }}
                />
              </div>
            )}

            {activeView === "playlists" && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-muted-foreground">
                  <p>Playlists coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mini player - desktop only */}
      {activeView !== "now-playing" && (
        <MiniPlayer
          track={playbackState.currentTrack}
          isPlaying={playbackState.isPlaying}
          currentTime={playbackState.currentTime}
          isFavorite={playbackState.currentTrack ? isFavorite(playbackState.currentTrack.id) : false}
          onTogglePlayPause={togglePlayPause}
          onNext={playNext}
          onPrevious={playPrevious}
          onSeek={seek}
          onToggleFavorite={() => {
            if (playbackState.currentTrack) {
              handleToggleFavorite(playbackState.currentTrack.id)
            }
          }}
          onExpand={handleExpandPlayer}
        />
      )}

      {/* Developer Credit - desktop only */}
      <div className="hidden md:block">
        <DeveloperCredit />
      </div>

      <MobileMiniPlayer
        track={playbackState.currentTrack}
        isPlaying={playbackState.isPlaying}
        currentTime={playbackState.currentTime}
        onTogglePlayPause={togglePlayPause}
        onExpand={handleExpandPlayer}
      />

      {/* Bottom navigation - mobile only */}
      <BottomNav activeView={activeView === "now-playing" ? "library" : activeView} onViewChange={handleViewChange} />

      {/* Mobile now playing - full screen overlay */}
      {showMobileNowPlaying && (
        <div className="md:hidden">
          <MobileNowPlaying
            track={playbackState.currentTrack}
            isPlaying={playbackState.isPlaying}
            currentTime={playbackState.currentTime}
            repeat={playbackState.repeat}
            shuffle={playbackState.shuffle}
            isFavorite={playbackState.currentTrack ? isFavorite(playbackState.currentTrack.id) : false}
            onTogglePlayPause={togglePlayPause}
            onNext={playNext}
            onPrevious={playPrevious}
            onSeek={seek}
            onToggleRepeat={toggleRepeat}
            onToggleShuffle={toggleShuffle}
            onToggleFavorite={() => {
              if (playbackState.currentTrack) {
                handleToggleFavorite(playbackState.currentTrack.id)
              }
            }}
            onClose={handleCloseMobileNowPlaying}
          />
        </div>
      )}

      {/* Edit dialog */}
      <EditTrackDialog
        track={editingTrack}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTrack}
      />
    </div>
  )
}
