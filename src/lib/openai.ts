import OpenAI from 'openai'
import { useSettingsStore } from './store/settings-store'

export interface PromptResponse {
  content: string
  model: 'gpt-4' | 'gpt-3.5-turbo'
  timestamp: number
  tokens: number
  responseTime: number
}

export const createOpenAIClient = () => {
  if (typeof window === 'undefined') return null

  const settings = useSettingsStore.getState().settings
  const apiKey = settings.openAIKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please add your API key in settings.')
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })
}

export async function generatePromptResponse(
  prompt: string,
  model: 'gpt-4' | 'gpt-3.5-turbo'
): Promise<PromptResponse> {
  const startTime = performance.now()

  try {
    const openai = createOpenAIClient()

    if (!openai) {
      throw new Error('OpenAI client initialization failed')
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: model === 'gpt-4' ? 'gpt-4-turbo-preview' : 'gpt-3.5-turbo',
    })

    const endTime = performance.now()
    const responseTime = (endTime - startTime) / 1000 // Convert to seconds

    return {
      content: completion.choices[0]?.message?.content || 'No response generated',
      model,
      timestamp: Date.now(),
      tokens: completion.usage?.total_tokens || 0,
      responseTime,
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw new Error(error instanceof Error ? error.message : 'Failed to generate response')
  }
}

export async function generateBlogPost(prompt: string): Promise<PromptResponse> {
  const startTime = performance.now()

  try {
    const openai = createOpenAIClient()

    if (!openai) {
      throw new Error('OpenAI client initialization failed')
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a professional blog writer. Write engaging, well-structured blog posts with proper formatting using HTML. Include headings (h1, h2, h3), paragraphs, and proper emphasis where needed.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4-turbo-preview',
      temperature: 0.7,
      max_tokens: 2000,
    })

    const endTime = performance.now()
    const responseTime = (endTime - startTime) / 1000 // Convert to seconds

    if (!completion.choices[0]?.message?.content) {
      throw new Error('No content generated')
    }

    return {
      content: completion.choices[0].message.content,
      model: 'gpt-4',
      timestamp: Date.now(),
      tokens: completion.usage?.total_tokens || 0,
      responseTime,
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your OpenAI API key in the settings')
      }
      if (error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again later')
      }
      throw new Error(`Generation failed: ${error.message}`)
    }

    throw new Error('Failed to generate blog post. Please try again')
  }
}
