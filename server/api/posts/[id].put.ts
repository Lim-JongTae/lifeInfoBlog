import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'ID is required'
    })
  }

  const { title, slug, description, content, categoryId, tags, published } = body

  // 슬러그 중복 확인 (자기 자신 제외)
  if (slug) {
    const existing = await prisma.post.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    })

    if (existing) {
      throw createError({
        statusCode: 400,
        message: '이미 사용 중인 슬러그입니다.'
      })
    }
  }

  // 글 수정
  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(description !== undefined && { description }),
      ...(content && { content }),
      ...(categoryId && { categoryId }),
      ...(tags && { tags }),
      ...(published !== undefined && { published })
    },
    include: {
      category: true
    }
  })

  return post
})