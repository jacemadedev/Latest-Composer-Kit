import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'
import { validatePromptRequest } from '@/lib/supabase/types'
import { generatePromptResponse } from '@/lib/openai'
import { rateLimit } from '@/lib/rate-limit'
import { handleError } from '@/lib/utils/error-handling'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting
    const identifier = session.user.id
    const { success, remaining } = await rateLimit(identifier)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'Retry-After': '60'
          }
        }
      )
    }

    // Validate request body
    const body = await req.json()
    const validatedData = validatePromptRequest({
      ...body,
      userId: session.user.id,
    })

    // Generate response
    const response = await generatePromptResponse(
      validatedData.prompt,
      validatedData.model
    )

    // Save to database
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        user_id: session.user.id,
        prompt: validatedData.prompt,
        output: response.content,
        model: validatedData.model,
        tokens: response.tokens,
        response_time: response.responseTime,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      data,
      remaining
    }, {
      headers: {
        'X-RateLimit-Remaining': remaining.toString()
      }
    })
  } catch (error) {
    const appError = handleError(error)
    return NextResponse.json(
      { error: appError.message },
      { status: appError.statusCode }
    )
  }
}