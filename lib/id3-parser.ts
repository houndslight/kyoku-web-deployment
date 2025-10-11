"use client"

import type { Track } from "./types"

export async function parseAudioFile(file: File): Promise<Partial<Track>> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const dataView = new DataView(arrayBuffer)

      const metadata: Partial<Track> = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown Artist",
        album: "Unknown Album",
        filePath: URL.createObjectURL(file),
      }

      // Check for ID3v2 tag
      if (dataView.byteLength > 10) {
        const id3Header = String.fromCharCode(dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2))

        if (id3Header === "ID3") {
          const id3Data = parseID3v2(dataView)
          Object.assign(metadata, id3Data)
        }
      }

      // Get duration using Audio element
      const audio = new Audio()
      audio.src = metadata.filePath!

      audio.addEventListener("loadedmetadata", () => {
        metadata.duration = audio.duration
        resolve(metadata)
      })

      audio.addEventListener("error", () => {
        metadata.duration = 0
        resolve(metadata)
      })
    }

    reader.readAsArrayBuffer(file.slice(0, 1024 * 1024)) // Read first 1MB for metadata
  })
}

function parseID3v2(dataView: DataView): Partial<Track> {
  const metadata: Partial<Track> = {}

  try {
    const version = dataView.getUint8(3)
    const flags = dataView.getUint8(5)

    // Calculate tag size (synchsafe integer)
    const size =
      (dataView.getUint8(6) << 21) | (dataView.getUint8(7) << 14) | (dataView.getUint8(8) << 7) | dataView.getUint8(9)

    let offset = 10

    // Parse frames
    while (offset < size + 10) {
      if (offset + 10 > dataView.byteLength) break

      const frameId = String.fromCharCode(
        dataView.getUint8(offset),
        dataView.getUint8(offset + 1),
        dataView.getUint8(offset + 2),
        dataView.getUint8(offset + 3),
      )

      if (frameId === "\0\0\0\0") break

      const frameSize =
        version === 4
          ? (dataView.getUint8(offset + 4) << 21) |
            (dataView.getUint8(offset + 5) << 14) |
            (dataView.getUint8(offset + 6) << 7) |
            dataView.getUint8(offset + 7)
          : (dataView.getUint8(offset + 4) << 24) |
            (dataView.getUint8(offset + 5) << 16) |
            (dataView.getUint8(offset + 6) << 8) |
            dataView.getUint8(offset + 7)

      const frameData = new Uint8Array(
        dataView.buffer,
        offset + 10,
        Math.min(frameSize, dataView.byteLength - offset - 10),
      )

      // Parse text frames
      if (frameId.startsWith("T") && frameId !== "TXXX") {
        const text = decodeTextFrame(frameData)

        switch (frameId) {
          case "TIT2":
            metadata.title = text
            break
          case "TPE1":
            metadata.artist = text
            break
          case "TALB":
            metadata.album = text
            break
          case "TYER":
          case "TDRC":
            metadata.year = text
            break
          case "TCON":
            metadata.genre = text
            break
          case "TRCK":
            metadata.trackNumber = Number.parseInt(text)
            break
        }
      }

      // Parse APIC (cover art) frame
      if (frameId === "APIC" && frameSize > 0) {
        const coverArt = parseAPICFrame(frameData)
        if (coverArt) {
          metadata.coverArt = coverArt
        }
      }

      offset += 10 + frameSize
    }
  } catch (error) {
    console.error("[v0] Error parsing ID3 tags:", error)
  }

  return metadata
}

function decodeTextFrame(data: Uint8Array): string {
  if (data.length === 0) return ""

  const encoding = data[0]
  const textData = data.slice(1)

  try {
    switch (encoding) {
      case 0: // ISO-8859-1
        return new TextDecoder("iso-8859-1").decode(textData)
      case 1: // UTF-16 with BOM
        return new TextDecoder("utf-16").decode(textData)
      case 2: // UTF-16BE
        return new TextDecoder("utf-16be").decode(textData)
      case 3: // UTF-8
        return new TextDecoder("utf-8").decode(textData)
      default:
        return new TextDecoder("utf-8").decode(textData)
    }
  } catch {
    return ""
  }
}

function parseAPICFrame(data: Uint8Array): string | null {
  try {
    const encoding = data[0]
    let offset = 1

    // Skip MIME type (null-terminated)
    while (offset < data.length && data[offset] !== 0) offset++
    offset++ // Skip null terminator

    // Skip picture type
    offset++

    // Skip description (null-terminated)
    while (offset < data.length && data[offset] !== 0) offset++
    offset++ // Skip null terminator

    // Remaining data is the image
    const imageData = data.slice(offset)
    const blob = new Blob([imageData])
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

export function extractCoverArt(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      const dataView = new DataView(arrayBuffer)

      if (dataView.byteLength > 10) {
        const id3Header = String.fromCharCode(dataView.getUint8(0), dataView.getUint8(1), dataView.getUint8(2))

        if (id3Header === "ID3") {
          const metadata = parseID3v2(dataView)
          resolve(metadata.coverArt || null)
          return
        }
      }

      resolve(null)
    }

    reader.onerror = () => resolve(null)
    reader.readAsArrayBuffer(file.slice(0, 1024 * 1024))
  })
}
