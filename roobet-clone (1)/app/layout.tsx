import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Roobet - Crypto Casino',
  description: 'The premier crypto casino experience. Play Crash, Dice, Mines, Plinko, Roulette, and Coinflip.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
