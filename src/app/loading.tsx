import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <Skeleton className="mx-auto h-8 w-3/4" />
        <Skeleton className="mx-auto h-4 w-1/2" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    </div>
  )
}
