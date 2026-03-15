import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LeadPulse — Discover High-Intent Leads from Social Media',
  description:
    'LeadPulse scans Reddit and X (Twitter) to find people actively looking for products like yours, then helps you reply with AI-crafted messages.',
  keywords: ['lead generation', 'social listening', 'Reddit leads', 'Twitter leads', 'buyer intent', 'SaaS'],
  openGraph: {
    title: 'LeadPulse',
    description: 'Catch the signal before your competitors do.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'LeadPulse',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
