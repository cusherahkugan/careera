import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Careera - Find work that fits',
  description:
    'A straightforward job board. Build one profile, apply in a click, and track every application in one place.',
  keywords: ['jobs', 'recruitment', 'hiring', 'careers'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-zinc-800 antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}