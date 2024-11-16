'use server'

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/lib/supabase/database.types'

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    const { id } = params

    const { error } = await supabase.from('prompts').delete().eq('id', id)

    if (error) {
      throw error
    }

    return new Response(null, { status: 200 })
  } catch (error) {
    console.error('Error deleting prompt:', error)
    return new Response('Error deleting prompt', { status: 500 })
  }
}
