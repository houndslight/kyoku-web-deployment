"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Track, PlaybackState } from "@/lib/types"
import { audioManager } from "@/lib/audio-manager"
import { storage } from "@/lib/storage"

export function useAudioPlayer() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 1,
    repeat: "none",
    shuffle: false,
  })

  const [queue, setQueue] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const originalQueueRef = useRef<Track[]>([])

  useEffect(() => {
    const handleTimeUpdate = (time: number) => {
      setPlaybackState((prev) => ({ ...prev, currentTime: time }))
    }

    const handleEnded = () => {
      if (playbackState.repeat === "one") {
        audioManager.seek(0)
        audioManager.play()
      } else {
        playNext()
      }
    }

    const handlePlay = () => {
      setPlaybackState((prev) => ({ ...prev, isPlaying: true }))
    }

    const handlePause = () => {
      setPlaybackState((prev) => ({ ...prev, isPlaying: false }))
    }

    audioManager.on("timeupdate", handleTimeUpdate)
    audioManager.on("ended", handleEnded)
    audioManager.on("play", handlePlay)
    audioManager.on("pause", handlePause)

    return () => {
      audioManager.off("timeupdate", handleTimeUpdate)
      audioManager.off("ended", handleEnded)
      audioManager.off("play", handlePlay)
      audioManager.off("pause", handlePause)
    }
  }, [playbackState.repeat, currentIndex, queue])

  const loadTrack = useCallback(async (track: Track) => {
    await audioManager.loadTrack(track)
    setPlaybackState((prev) => ({ ...prev, currentTrack: track, currentTime: 0 }))
    storage.addToRecentlyPlayed(track.id)
  }, [])

  const playTrack = useCallback(
    async (track: Track, trackList?: Track[]) => {
      if (trackList) {
        originalQueueRef.current = trackList
        setQueue(playbackState.shuffle ? shuffleArray([...trackList]) : trackList)
        const index = trackList.findIndex((t) => t.id === track.id)
        setCurrentIndex(index)
      }

      await loadTrack(track)
      await audioManager.play()
    },
    [loadTrack, playbackState.shuffle],
  )

  const togglePlayPause = useCallback(() => {
    if (playbackState.isPlaying) {
      audioManager.pause()
    } else {
      audioManager.play()
    }
  }, [playbackState.isPlaying])

  const playNext = useCallback(() => {
    if (queue.length === 0) return

    let nextIndex = currentIndex + 1

    if (nextIndex >= queue.length) {
      if (playbackState.repeat === "all") {
        nextIndex = 0
      } else {
        audioManager.pause()
        return
      }
    }

    setCurrentIndex(nextIndex)
    playTrack(queue[nextIndex])
  }, [queue, currentIndex, playbackState.repeat, playTrack])

  const playPrevious = useCallback(() => {
    if (queue.length === 0) return

    if (playbackState.currentTime > 3) {
      audioManager.seek(0)
      return
    }

    let prevIndex = currentIndex - 1

    if (prevIndex < 0) {
      if (playbackState.repeat === "all") {
        prevIndex = queue.length - 1
      } else {
        return
      }
    }

    setCurrentIndex(prevIndex)
    playTrack(queue[prevIndex])
  }, [queue, currentIndex, playbackState.currentTime, playbackState.repeat, playTrack])

  const seek = useCallback((time: number) => {
    audioManager.seek(time)
    setPlaybackState((prev) => ({ ...prev, currentTime: time }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    audioManager.setVolume(volume)
    setPlaybackState((prev) => ({ ...prev, volume }))
  }, [])

  const toggleRepeat = useCallback(() => {
    setPlaybackState((prev) => ({
      ...prev,
      repeat: prev.repeat === "none" ? "all" : prev.repeat === "all" ? "one" : "none",
    }))
  }, [])

  const toggleShuffle = useCallback(() => {
    const newShuffle = !playbackState.shuffle

    if (newShuffle) {
      const currentTrack = queue[currentIndex]
      const shuffled = shuffleArray([...originalQueueRef.current])
      const newIndex = shuffled.findIndex((t) => t.id === currentTrack?.id)
      setQueue(shuffled)
      setCurrentIndex(newIndex)
    } else {
      const currentTrack = queue[currentIndex]
      const newIndex = originalQueueRef.current.findIndex((t) => t.id === currentTrack?.id)
      setQueue([...originalQueueRef.current])
      setCurrentIndex(newIndex)
    }

    setPlaybackState((prev) => ({ ...prev, shuffle: newShuffle }))
  }, [playbackState.shuffle, queue, currentIndex])

  return {
    playbackState,
    queue,
    currentIndex,
    playTrack,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  }
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}
