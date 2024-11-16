"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { supabase } from "@/lib/supabase"
import { LoadingBoundary } from "@/components/loading-boundary"
import { ErrorBoundary } from "@/components/error-boundary"
import { toast } from "@/components/ui/use-toast"

const getBreadcrumb = (pathname: string) => {
  switch (pathname) {
    case '/':
      return { title: "Prompt Editor" }
    case '/history':
      return { title: "History" }
    default:
      return { title: "Dashboard" }
  }
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/auth')
      } else {
        setIsAuthenticated(true)
      }
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/auth')
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  // Handle payment status from URL parameters
  useEffect(() => {
    const payment = searchParams.get('payment')
    if (payment === 'success') {
      toast({
        title: "Payment Successful",
        description: "Your tokens have been added to your account.",
      })
      // Remove the payment parameter from the URL
      const newUrl = pathname
      router.replace(newUrl)
    } else if (payment === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. No tokens were added.",
        variant: "destructive",
      })
      // Remove the payment parameter from the URL
      const newUrl = pathname
      router.replace(newUrl)
    }
  }, [searchParams, pathname, router])

  if (!isAuthenticated) {
    return null
  }

  const breadcrumb = getBreadcrumb(pathname)

  return (
    <ErrorBoundary>
      <LoadingBoundary>
        <AppLayout breadcrumb={breadcrumb}>{children}</AppLayout>
      </LoadingBoundary>
    </ErrorBoundary>
  )
}