"use client"

import React, { Suspense } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/layout/app-layout"
import { PromptFineTuningAppComponent } from "@/components/prompt-fine-tuning-app"
import { supabase } from "@/lib/supabase"
import { LoadingBoundary } from "@/components/loading-boundary"
import { ErrorBoundary } from "@/components/error-boundary"

export default function Page() {
  const router = useRouter()

  return (
    <ErrorBoundary>
      <LoadingBoundary>
        <AuthenticatedContent router={router} />
      </LoadingBoundary>
    </ErrorBoundary>
  )
}

function AuthenticatedContent({ router }: { router: ReturnType<typeof useRouter> }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)

  React.useEffect(() => {
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <AppLayout breadcrumb={{ title: "Prompt Editor" }}>
      <Suspense fallback={<div>Loading prompt editor...</div>}>
        <PromptFineTuningAppComponent />
      </Suspense>
    </AppLayout>
  )
}