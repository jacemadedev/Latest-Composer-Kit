"use client"

import { useState } from 'react'
import { Bot, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { generateBlogPost } from '@/lib/openai'
import { supabase } from '@/lib/supabase'
import { getAnalytics, AnalyticsStats } from '@/lib/analytics'

interface BlogGeneratorProps {
  onGenerate: (content: string) => void
  onStatsUpdate: (stats: AnalyticsStats) => void
}

export function BlogGenerator({ onGenerate, onStatsUpdate }: BlogGeneratorProps) {
  const [title, setTitle] = useState('')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!title.trim() || !topic.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and topic for your blog post.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      const prompt = `
        Write a detailed blog post with the following specifications:
        Title: ${title}
        Topic: ${topic}
        ${keywords ? `Keywords to include: ${keywords}` : ''}
        
        Format the blog post using HTML with proper headings (h1, h2, h3), paragraphs, and emphasis.
        Include:
        - An engaging introduction
        - Multiple sections with clear subheadings
        - Relevant examples and explanations
        - A strong conclusion
        
        Make the content informative, engaging, and well-structured.
      `.trim()

      const response = await generateBlogPost(prompt)
      
      // Save to database
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('prompts').insert({
          user_id: user.id,
          prompt: prompt,
          output: response.content,
          model: response.model,
          tokens: response.tokens,
          response_time: response.responseTime,
          type: 'blog'
        })

        // Update stats
        const updatedStats = await getAnalytics(user.id, 'blog')
        onStatsUpdate(updatedStats)
      }

      onGenerate(response.content)
      
      toast({
        title: "Success",
        description: "Your blog post has been generated successfully!",
      })

      // Clear the form
      setTitle('')
      setTopic('')
      setKeywords('')
    } catch (error) {
      console.error('Blog generation error:', error)
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate blog post",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Post Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Blog Title</Label>
          <Input
            id="title"
            placeholder="Enter your blog post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Textarea
            id="topic"
            placeholder="Describe what you want to write about"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords (optional)</Label>
          <Input
            id="keywords"
            placeholder="Enter keywords separated by commas"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Bot className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Blog Post
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}