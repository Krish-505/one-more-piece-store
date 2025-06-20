// in app/layout.tsx
import './globals.css'
import type { Metadata } from 'next'
import { Inter, Press_Start_2P } from 'next/font/google' // <-- IMPORT FONTS

// Configure the fonts and assign CSS variables
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const press_start = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start',
})

export const metadata: Metadata = {
  title: 'One More Piece',
  description: 'Vintage & Thrifted Clothing Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* THIS IS THE MOST IMPORTANT PART - APPLY THE VARIABLES */}
      <body className={`${inter.variable} ${press_start.variable}`}>
        {children}
      </body>
    </html>
  )
}