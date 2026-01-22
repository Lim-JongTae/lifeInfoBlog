import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      message: 'Slug is required'
    })
  }

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