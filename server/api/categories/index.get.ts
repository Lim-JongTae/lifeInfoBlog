import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async () => {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { posts: true }
      }
    }
  })

  return categories
})