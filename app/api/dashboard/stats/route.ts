// app/api/dashboard/stats/route.ts

import { getSupabaseAdmin } from "@/lib/db/supabase"  // ✅ 
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = getSupabaseAdmin()  // ✅ function call
  
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      )
    }

    const { count: storiesCount } = await supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    const { count: kidsCount } = await supabase
      .from("kids_profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)

    const { data: recentStories } = await supabase
      .from("stories")
      .select(`
        id,
        title,
        theme,
        created_at,
        view_count,
        kids_profiles (
          name,
          gender
        )
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    return NextResponse.json({
      stats: {
        storiesCount: storiesCount || 0,
        kidsCount: kidsCount || 0
      },
      recentStories: recentStories || []
    })

  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}