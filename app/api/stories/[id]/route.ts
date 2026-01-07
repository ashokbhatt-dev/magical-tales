// app/api/stories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db/supabase' // ✅ নাম চেঞ্জ করা হয়েছে

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // ✅ Next.js 15+ এ params Promise হয়
) {
  try {
    const supabase = getSupabaseAdmin() // ✅ ফাংশন কল করা হলো
    const { id } = await params // ✅ await করা হলো

    // Get story from database
    const { data: story, error } = await supabase // ✅ supabase instance ব্যবহার
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
    await supabase
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