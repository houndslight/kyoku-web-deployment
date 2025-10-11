"use client"

import type { Track } from "./types"

class AudioManager {
  private audio: HTMLAudioElement | null = null
  private currentTrack: Track | null = null
  private listeners: Map<string, Set<Function>> = new Map()

  constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio()
      this.setupEventListeners()
    }
  }

  private setupEventListeners() {
    if (!this.audio) return

    this.audio.addEventListener("timeupdate", () => {
      this.emit("timeupdate", this.audio!.currentTime)
    })

    this.audio.addEventListener("ended", () => {
      this.emit("ended")
    })

    this.audio.addEventListener("play", () => {
      this.emit("play")
    })

    this.audio.addEventListener("pause", () => {
      this.emit("pause")
    })

    this.audio.addEventListener("loadedmetadata", () => {
      this.emit("loadedmetadata", this.audio!.duration)
    })
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback)
  }

  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach((callback) => callback(...args))
  }

  async loadTrack(track: Track) {
    if (!this.audio) return

    this.currentTrack = track
    this.audio.src = track.filePath
    await this.audio.load()
  }

  play() {
    return this.audio?.play()
  }

  pause() {
    this.audio?.pause()
  }

  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time
    }
  }

  setVolume(volume: number) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  getCurrentTime() {
    return this.audio?.currentTime || 0
  }

  getDuration() {
    return this.audio?.duration || 0
  }

  getCurrentTrack() {
    return this.currentTrack
  }
}

export const audioManager = new AudioManager()
