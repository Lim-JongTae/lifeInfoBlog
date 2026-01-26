import { prisma } from '~~/server/utils/prisma'
import { getKstMidnight } from '~~/server/utils/date'
import { setCookie, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ slug: string }>(event)
  const slug = body?.slug
  
  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug is required' })
  }

  // 5분 내 중복 조회수 방지
  const throttleKey = `pv_${slug}`
  const already = getCookie(event, throttleKey)
  if (already) {
    return { success: true, throttled: true }
  }
  
  setCookie(event, throttleKey, '1', {
    maxAge: 60 * 5,
    httpOnly: true,
    sameSite: 'lax',
    path: '/'
  })

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true, published: true }
  })
  
  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }
  
  if (!post.published) {
    throw createError({ statusCode: 403, statusMessage: 'Not published' })
  }

  // 한국 시간 자정 기준
  const viewedAt = getKstMidnight(new Date())

  try {
    await prisma.$transaction(async (tx) => {
      // 일별 집계 upsert
      await tx.pageView.upsert({
        where: { 
          postId_viewedAt: { 
            postId: post.id, 
            viewedAt 
          } 
        },
        update: { count: { increment: 1 } },
        create: { postId: post.id, viewedAt, count: 1 }
      })
      
      // Post viewCount 증가
      await tx.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } }
      })
    })
    
    return { success: true }
  } catch (e) {
    console.error('View count error:', e)
    throw createError({ statusCode: 500, statusMessage: 'Increment failed' })
  }
})