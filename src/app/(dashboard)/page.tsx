import { Suspense } from 'react'
import { PromptFineTuningAppComponent } from '@/components/prompt-fine-tuning-app'
import { CardLoadingFallback } from '@/components/loading-boundary'

export default function Page() {
  return (
    <Suspense fallback={<CardLoadingFallback />}>
      <PromptFineTuningAppComponent />
    </Suspense>
  )
}
