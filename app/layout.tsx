// app/layout.tsx
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ApiProvider } from '@/components/ApiProvider' // <-- Import component mới

export const metadata: Metadata = {
  title: 'ECGMS App',
  description: 'Created with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ApiProvider>  {/* <-- Bọc children bằng ApiProvider */}
          {children}
        </ApiProvider>
        <Analytics />
      </body>
    </html>
  )
}