import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/error/error-boundary'
import { ToastProvider } from '@/components/ui/toast'
import { ThemeProvider } from '@/components/theme/theme-provider'

export const metadata: Metadata = {
  title: {
    template: '%s | Composer Kit',
    default: 'Composer Kit - AI SaaS Boilerplate',
  },
  description:
    'Production-ready Next.js boilerplate for building AI-powered SaaS applications. Features authentication, API rate limiting, Stripe integration, and more.',
  keywords: [
    'AI SaaS',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'OpenAI',
    'Supabase',
    'Stripe',
    'SaaS Boilerplate',
    'AI Development',
    'Web Development',
    'API Integration',
  ],
  authors: [{ name: 'StackBlitz' }],
  creator: 'StackBlitz',
  publisher: 'StackBlitz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://composer-kit.vercel.app',
    title: 'Composer Kit - AI SaaS Boilerplate',
    description: 'Production-ready Next.js boilerplate for building AI-powered SaaS applications',
    siteName: 'Composer Kit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Composer Kit - AI SaaS Boilerplate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Composer Kit - AI SaaS Boilerplate',
    description: 'Production-ready Next.js boilerplate for building AI-powered SaaS applications',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://composer-kit.vercel.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider
          defaultTheme="system"
          enableSystem
        >
          <ToastProvider>
            <ErrorBoundary>
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
