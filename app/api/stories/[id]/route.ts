// app/api/stories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Get story from database
    const { data: story, error } = await supabaseAdmin
      .from('stories')
      .select(`
        *,
        kids_profiles (name, gender, age),
        users (name, email)
      `)
      .eq('id', id)
      .single()

    if (error || !story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await supabaseAdmin
      .from('stories')
      .update({ view_count: (story.view_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json({ story }, { status: 200 })

  } catch (error) {
    console.error('Get story error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}