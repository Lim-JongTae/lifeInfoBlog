import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { slug } = body

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }
  // 게시글 찾기
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true }
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      message: 'Post not found'
    })
  }
  // 게시글 조회수 증가
  await prisma.post.update({
    where: { slug },
    data: { viewCount: { increment: 1 } }
  })

  // 일별 조회수 기록
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

try {
  await prisma.pageView.upsert({
    where: {
      postId_viewedAt: {
        postId: post.id,
        viewedAt: today
      }
    },
    update: { count: { increment: 1 } },
    create: {
      postId: post.id,
      viewedAt: today,
      count: 1
    }
  })
} catch (error) {
  console.error('PageView upset error:', error)
}
return { success: true }
  
})


