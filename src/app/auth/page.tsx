"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push("/")
      }
    }
    checkAuth()
  }, [router])

  return <AuthLayout />
}