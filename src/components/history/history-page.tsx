"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { AnimatedSection, fadeIn } from "@/components/ui/motion"
import { CardLoadingFallback, TableLoadingFallback } from "@/components/loading-boundary"

const HistoryStats = dynamic(() => import("./history-stats").then(mod => mod.HistoryStats), {
  loading: () => <CardLoadingFallback />,
  ssr: false
})

const HistoryList = dynamic(() => import("./history-list").then(mod => mod.HistoryList), {
  loading: () => <TableLoadingFallback />,
  ssr: false
})

export function HistoryPage() {
  return (
    <AnimatedSection
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Suspense fallback={<CardLoadingFallback />}>
        <HistoryStats />
      </Suspense>
      <Suspense fallback={<TableLoadingFallback />}>
        <HistoryList />
      </Suspense>
    </AnimatedSection>
  )
}