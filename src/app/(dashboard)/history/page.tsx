import { Suspense } from "react"
import { HistoryPage } from "@/components/history/history-page"
import { TableLoadingFallback } from "@/components/loading-boundary"

export default function Page() {
  return (
    <Suspense fallback={<TableLoadingFallback />}>
      <HistoryPage />
    </Suspense>
  )
}