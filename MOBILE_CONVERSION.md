# Mobile Conversion Guide

This music player is designed to be easily converted to native mobile apps using Electron (desktop) and React Native (mobile).

## Architecture Overview

The app is built with a clean separation of concerns:

- **State Management**: Custom hooks (`use-music-library.ts`, `use-audio-player.ts`)
- **Storage**: LocalStorage-based persistence (`lib/storage.ts`)
- **Audio Processing**: ID3 tag parsing and audio management (`lib/id3-parser.ts`, `lib/audio-manager.ts`)
- **UI Components**: Responsive React components with mobile-first design

## Converting to Electron (Desktop App)

### 1. Install Electron Dependencies
\`\`\`bash
npm install electron electron-builder --save-dev
\`\`\`

### 2. Create Electron Main Process
Create `electron/main.js`:
\`\`\`javascript
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  win.loadURL('http://localhost:3000') // Development
  // win.loadFile('out/index.html') // Production
}

app.whenReady().then(createWindow)
\`\`\`

### 3. Update Package.json
\`\`\`json
{
  "main": "electron/main.js",
  "scripts": {
    "electron": "electron .",
    "electron:build": "next build && next export && electron-builder"
  }
}
\`\`\`

## Converting to React Native (iOS/Android)

### 1. Key Changes Needed

#### Replace Web APIs:
- **File System**: Use `react-native-fs` instead of File API
- **Audio Playback**: Use `react-native-track-player` instead of Web Audio API
- **Storage**: Use `@react-native-async-storage/async-storage` instead of localStorage
- **ID3 Parsing**: Use `react-native-id3-parser` or similar

#### Component Mapping:
- `<div>` → `<View>`
- `<button>` → `<TouchableOpacity>` or `<Pressable>`
- `<input>` → `<TextInput>`
- `<img>` → `<Image>`
- CSS classes → StyleSheet.create()

### 2. File Structure for React Native
\`\`\`
/mobile
  /src
    /components (convert existing components)
    /hooks (reuse existing hooks with platform-specific adapters)
    /lib (adapt for React Native APIs)
    /screens (convert views to screens)
  App.tsx
  package.json
\`\`\`

### 3. Platform-Specific Adapters

Create adapter files to bridge web and native APIs:

**storage-adapter.native.ts**:
\`\`\`typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

export const storage = {
  getItem: (key: string) => AsyncStorage.getItem(key),
  setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
  removeItem: (key: string) => AsyncStorage.removeItem(key)
}
\`\`\`

**audio-adapter.native.ts**:
\`\`\`typescript
import TrackPlayer from 'react-native-track-player'

export const audioManager = {
  // Implement using react-native-track-player
}
\`\`\`

### 4. Navigation
Use React Navigation for mobile:
\`\`\`bash
npm install @react-navigation/native @react-navigation/bottom-tabs
\`\`\`

The existing bottom navigation component can be adapted to use React Navigation's tab navigator.

## Responsive Design Features

The app already includes:
- ✅ Mobile-first responsive design
- ✅ Bottom navigation for mobile
- ✅ Full-screen now playing view (Apple Music style)
- ✅ Touch-friendly tap targets (44px minimum)
- ✅ Safe area insets for notches and home indicators
- ✅ Smooth scrolling optimizations
- ✅ Responsive breakpoints (sm: 640px, md: 768px, lg: 1024px)

## Screen Size Support

Tested and optimized for:
- **iPhone**: 6/7/8 (375px), X/11/12/13/14/15 (390px), Plus/Max (428px), 16/17 (402px)
- **Android**: Samsung Galaxy (360-412px), OnePlus (412px), Pixel (393px), Huawei (360-412px)
- **Tablets**: iPad (768px+), Android tablets (600px+)
- **Desktop**: 1024px+

## Key Files to Adapt

### Core Logic (Reusable):
- `lib/types.ts` - Type definitions
- `hooks/use-music-library.ts` - Library management (adapt storage)
- `hooks/use-audio-player.ts` - Playback logic (adapt audio API)

### Platform-Specific:
- `lib/storage.ts` - Replace with AsyncStorage
- `lib/audio-manager.ts` - Replace with react-native-track-player
- `lib/id3-parser.ts` - Replace with native ID3 parser

### UI Components:
- All components in `/components` - Convert to React Native components
- Maintain the same component structure and props

## Theme System

The theme customization system uses CSS variables. For React Native:
- Convert to React Context with theme values
- Use StyleSheet.create() with theme colors
- Implement theme persistence with AsyncStorage

## Next Steps

1. **For Electron**: Follow the Electron conversion steps above
2. **For React Native**: Set up a new React Native project and gradually migrate components
3. **Testing**: Test on physical devices for all target platforms
4. **Performance**: Profile and optimize for each platform

The clean architecture makes this conversion straightforward - most business logic can be reused with platform-specific adapters for storage, audio, and file system APIs.
