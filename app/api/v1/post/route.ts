import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/supabase/server'
import { ApiError, revalidatePaths, setMeta } from '@/lib/utils'
import { authorize } from '@/queries/server/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const id = searchParams.get('id') as string
  const userId = searchParams.get('userId') as string
  const slug = searchParams.get('slug') as string
  const postType = (searchParams.get('postType') as string) ?? 'post'
  const postStatus = searchParams.get('postStatus') as string

  let match = {}

  if (id) match = { ...match, id }
  if (userId) match = { ...match, user_id: userId }
  if (postType) match = { ...match, type: postType }
  if (postStatus) match = { ...match, status: postStatus }
  if (slug) match = { ...match, slug }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .select('*, author:profiles(*), meta:post_metas(*)')
    .match(match)
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const data = setMeta(result?.data)

  return NextResponse.json({ data, error: null })
}

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { formData, options } = await request.json()
  const { user_id, ...body } = formData
  const { user } = await authorize(user_id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase
    .from('posts')
    .update(body)
    .match({ id, user_id })
    .select('*, author:profiles(*), meta:post_metas(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const data = setMeta(result?.data)
  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data,
    error: null,
    revalidated,
    now: Date.now(),
  })
}

export async function PUT(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId') as string

  const { formData, options } = await request.json()
  const { user, plan } = await authorize(userId)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const total = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (total?.error) {
    return NextResponse.json(
      { data: null, error: total?.error },
      { status: 400 }
    )
  }

  const count = total?.count ?? 0

  if (plan === 'free' && count > 2) {
    return NextResponse.json(
      { data: null, error: new ApiError(402) },
      { status: 402 }
    )
  }

  const result = await supabase
    .from('posts')
    .insert({ ...formData, user_id: userId })
    .select('*, author:profiles(*)')
    .single()

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: result?.data,
    error: null,
    revalidated,
    now: Date.now(),
  })
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get('id') as string

  const { formData, options } = await request.json()
  const { user_id } = formData
  const { user } = await authorize(user_id)

  if (!user) {
    return NextResponse.json(
      { data: null, error: new ApiError(401) },
      { status: 401 }
    )
  }

  const supabase = createClient()
  const result = await supabase.from('posts').delete().match({ id, user_id })

  if (result?.error) {
    return NextResponse.json(
      { data: null, error: result?.error },
      { status: 400 }
    )
  }

  const revalidated = revalidatePaths(options?.revalidatePaths)

  return NextResponse.json({
    data: null,
    error: null,
    revalidated,
    now: Date.now(),
  })
}
