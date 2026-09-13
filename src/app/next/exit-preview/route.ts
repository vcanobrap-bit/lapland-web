import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

/** Sale del modo borrador y vuelve al sitio publicado. */
export async function GET(request: NextRequest): Promise<Response> {
  const path = new URL(request.url).searchParams.get('path') ?? '/'
  const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/'

  const draft = await draftMode()
  draft.disable()

  redirect(safePath)
}
