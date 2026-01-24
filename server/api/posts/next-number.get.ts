import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const category = query.category as string
  const date = query.date as string

  if (!category || !date) {
    throw createError({
      statusCode: 400,
      message: 'category와 date가 필요합니다.'
    })
  }

  // 해당 카테고리와 날짜로 시작하는 슬러그 개수 조회
  const pattern = `${category}-${date}-%`
  
  const posts = await prisma.post.findMany({
    where: {
      slug: {
        startsWith: `${category}-${date}-`
      }
    },
    select: { slug: true }
  })

  // 가장 큰 순번 찾기
  let maxNumber = 0
  posts.forEach(post => {
    const parts = post.slug.split('-')
    const num = parseInt(parts[parts.length - 1], 10)
    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num
    }
  })

  return {
    nextNumber: maxNumber + 1
  }
})