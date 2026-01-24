import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slugParam = getRouterParam(event, 'slug')

  if (!slugParam) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

  // URL 디코딩 (한글 슬러그 지원)
  const slug = decodeURIComponent(slugParam)

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      category: true
    }
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      message: '게시글을 찾을 수 없습니다.'
    })
  }

  return post
})