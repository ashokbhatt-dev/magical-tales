// app/api/kids/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/db/supabase'

// GET - Fetch all kids for a user
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const userId = request.nextUrl.searchParams.get('userId')

    console.log('📚 GET /api/kids - userId:', userId)

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    const { data: kids, error } = await supabase
      .from('kids_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching kids:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('📚 Kids found:', kids?.length || 0)
    return NextResponse.json(kids || [])
  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new kid profile
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    console.log('📝 POST /api/kids - body:', body)

    const { userId, name, age, gender, interests } = body

    // Validation
    if (!userId || !name || !age || !gender) {
      return NextResponse.json(
        { error: 'userId, name, age, and gender are required' },
        { status: 400 }
      )
    }

    // ✅ Only insert columns that exist in your table
    const insertData = {
      user_id: userId,
      name: name,
      age: parseInt(age),
      gender: gender,
      interests: interests || []
    }

    console.log('📝 Inserting:', insertData)

    const { data: kid, error } = await supabase
      .from('kids_profiles')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating kid:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Kid created:', kid)
    return NextResponse.json(kid, { status: 201 })
  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a kid profile
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const body = await request.json()

    const { id, name, age, gender, interests } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Kid id is required' },
        { status: 400 }
      )
    }

    // ✅ Only update columns that exist
    const { data: kid, error } = await supabase
      .from('kids_profiles')
      .update({
        name,
        age: parseInt(age),
        gender,
        interests: interests || []
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating kid:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(kid)
  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Delete a kid profile
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    const kidId = request.nextUrl.searchParams.get('id')

    if (!kidId) {
      return NextResponse.json({ error: 'Kid id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from('kids_profiles')
      .delete()
      .eq('id', kidId)

    if (error) {
      console.error('❌ Error deleting kid:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}