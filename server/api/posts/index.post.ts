import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { title, slug, description, content, categoryId, tags, published } = body

  // 유효성 검사
  if (!title || !slug || !categoryId || !content) {
    throw createError({
      statusCode: 400,
      message: '필수 항목을 입력해주세요.'
    })
  }

  // 슬러그 중복 확인
  const existing = await prisma.post.findUnique({
    where: { slug }
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: '이미 사용 중인 슬러그입니다.'
    })
  }

  // 글 생성
  const post = await prisma.post.create({
    data: {
      title,
      slug,
      description: description || null,
      content,
      categoryId,
      tags: tags || [],
      published: published || false
    },
    include: {
      category: true
    }
  })

  return post
})