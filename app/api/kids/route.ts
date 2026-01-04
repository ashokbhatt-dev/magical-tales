// app/api/kids/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/db/supabase'

// GET - Fetch all kids for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const { data: kids, error } = await supabaseAdmin
      .from('kids_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch kids' },
        { status: 500 }
      )
    }

    return NextResponse.json({ kids }, { status: 200 })

  } catch (error) {
    console.error('Get kids error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new kid profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, gender, age, interests } = body

    if (!userId || !name || !gender || !age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: newKid, error } = await supabaseAdmin
      .from('kids_profiles')
      .insert([
        {
          user_id: userId,
          name,
          gender,
          age,
          interests: interests || []
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create kid profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Kid profile created', kid: newKid },
      { status: 201 }
    )

  } catch (error) {
    console.error('Create kid error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete kid profile
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const kidId = searchParams.get('id')

    if (!kidId) {
      return NextResponse.json(
        { error: 'Kid ID required' },
        { status: 400 }
      )
    }

    const { error } = await supabaseAdmin
      .from('kids_profiles')
      .delete()
      .eq('id', kidId)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to delete kid profile' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Kid profile deleted' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Delete kid error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}