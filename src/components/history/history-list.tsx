"use client"

import React, { useEffect, useState } from "react"
import { Copy, MoreVertical, Star, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { deletePrompt, getPromptHistory, PromptRecord } from "@/lib/supabase/prompts"
import { AnimatedCard, MotionDiv, slideIn } from "@/components/ui/motion"
import { subscribeToPrompts } from "@/lib/supabase/realtime"

export function HistoryList() {
  const [history, setHistory] = useState<PromptRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()

    // Subscribe to real-time updates
    const unsubscribe = subscribeToPrompts((payload) => {
      if (payload.eventType === 'INSERT') {
        setHistory((prev) => [payload.new, ...prev])
        toast({
          title: "New prompt added",
          description: "A new prompt has been added to your history.",
        })
      } else if (payload.eventType === 'DELETE') {
        setHistory((prev) => prev.filter((item) => item.id !== payload.old?.id))
      } else if (payload.eventType === 'UPDATE') {
        setHistory((prev) =>
          prev.map((item) => (item.id === payload.new.id ? payload.new : item))
        )
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const loadHistory = async () => {
    try {
      const data = await getPromptHistory()
      setHistory(data)
    } catch (error) {
      toast({
        title: "Error loading history",
        description: error instanceof Error ? error.message : "Failed to load history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    })
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePrompt(id)
      setHistory(history.filter(item => item.id !== id))
      toast({
        title: "Prompt deleted",
        description: "The prompt has been removed from your history.",
      })
    } catch (error) {
      toast({
        title: "Error deleting prompt",
        description: error instanceof Error ? error.message : "Failed to delete prompt",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Loading history...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <AnimatedCard className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Prompt History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground">No prompts in history</p>
            ) : (
              history.map((item, index) => (
                <MotionDiv
                  key={item.id}
                  variants={slideIn}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.1 }}
                  className="rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {item.prompt}
                      </p>
                      <div className="flex items-center pt-2 space-x-2">
                        <Badge variant="secondary">{item.model}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopy(item.prompt)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy prompt
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCopy(item.output)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy response
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Save as favorite
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.output}
                  </p>
                </MotionDiv>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedCard>
  )
}