import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Xenvolt - Flight Operations Platform',
  description: 'Xenvolt Flight Operations & Technical Log Management System',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/favicon-32x32.jpg',
        sizes: '32x32',
        type: 'image/jpeg',
      },
      {
        url: '/favicon-16x16.jpg',
        sizes: '16x16',
        type: 'image/jpeg',
      },
    ],
    apple: {
      url: '/apple-touch-icon.jpg',
      sizes: '180x180',
      type: 'image/jpeg',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
