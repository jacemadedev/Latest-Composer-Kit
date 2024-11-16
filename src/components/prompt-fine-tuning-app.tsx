'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { Bot, FileCode2, PenTool, SquareTerminal } from 'lucide-react'
import { generatePromptResponse } from '@/lib/openai'
import { savePrompt } from '@/lib/supabase/prompts'
import { useSettingsStore } from '@/lib/store/settings-store'
import { supabase } from '@/lib/supabase'
import { getAnalytics, AnalyticsStats } from '@/lib/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedCard, AnimatedSection, fadeIn } from '@/components/ui/motion'
import { CardLoadingFallback } from '@/components/loading-boundary'

const PromptForm = dynamic(
  () => import('./prompt-editor/prompt-form').then((mod) => mod.PromptForm),
  {
    loading: () => <CardLoadingFallback />,
    ssr: false,
  }
)

const OutputDisplay = dynamic(
  () => import('./prompt-editor/output-display').then((mod) => mod.OutputDisplay),
  {
    loading: () => <CardLoadingFallback />,
    ssr: false,
  }
)

export function PromptFineTuningAppComponent() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState<AnalyticsStats>({
    totalInteractions: 0,
    averageResponseTime: 0,
    tokenUsage: 0,
    successRate: 100,
    previousPeriodComparison: 0,
  })

  const { settings } = useSettingsStore()
  const [model, setModel] = useState<'gpt-4' | 'gpt-3.5-turbo'>(settings.defaultModel)

  useEffect(() => {
    const controller = new AbortController()

    async function loadStats() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const analyticsData = await getAnalytics(user.id)
        if (!controller.signal.aborted) {
          setStats(analyticsData)
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    loadStats()

    return () => {
      controller.abort()
    }
  }, [])

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value)
  }

  const handleModelChange = (value: 'gpt-4' | 'gpt-3.5-turbo') => {
    setModel(value)
  }

  const handleFineTune = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt before fine-tuning.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await generatePromptResponse(prompt, model)
      setOutput(response.content)

      await savePrompt(prompt, response)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const updatedStats = await getAnalytics(user.id)
        setStats(updatedStats)
      }

      toast({
        title: 'Success',
        description: 'Prompt fine-tuned successfully!',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to generate response',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDraft = () => {
    toast({
      title: 'Draft Saved',
      description: 'Your prompt draft has been saved.',
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(output)
    toast({
      title: 'Copied to Clipboard',
      description: 'The output has been copied to your clipboard.',
    })
  }

  const handleViewHistory = () => {
    router.push('/history')
  }

  return (
    <AnimatedSection
      className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedCard className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prompts</CardTitle>
              <FileCode2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInteractions}</div>
              <p className="text-xs text-muted-foreground">
                {stats.previousPeriodComparison > 0 ? '+' : ''}
                {stats.previousPeriodComparison.toFixed(1)}% from last month
              </p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fine-tuned Prompts</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInteractions}</div>
              <p className="text-xs text-muted-foreground">All prompts are fine-tuned</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageResponseTime.toFixed(1)}s</div>
              <p className="text-xs text-muted-foreground">Across all models</p>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard className="col-span-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Token Usage</CardTitle>
              <SquareTerminal className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.tokenUsage.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total tokens used</p>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Suspense fallback={<CardLoadingFallback />}>
          <AnimatedCard className="col-span-4">
            <PromptForm
              prompt={prompt}
              model={model}
              isLoading={isLoading}
              onPromptChange={handlePromptChange}
              onModelChange={handleModelChange}
              onSubmit={handleFineTune}
              onSaveDraft={handleSaveDraft}
            />
          </AnimatedCard>
        </Suspense>
        <Suspense fallback={<CardLoadingFallback />}>
          <AnimatedCard className="col-span-3">
            <OutputDisplay
              output={output}
              onShare={handleShare}
              onViewHistory={handleViewHistory}
            />
          </AnimatedCard>
        </Suspense>
      </div>
    </AnimatedSection>
  )
}
