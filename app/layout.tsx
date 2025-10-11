import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Kyoku ",
  description: "Minimalist Japanese-inspired music player",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kyoku ",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // For iPhone notch support
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-mincho antialiased">{children}</body>
    </html>
  )
}
