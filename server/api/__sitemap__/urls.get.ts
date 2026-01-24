import { prisma } from '~~/server/utils/prisma'


export default defineEventHandler(async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: {
      slug: true,
      updatedAt: true
    }
  })

  const categories = await prisma.category.findMany({
    select: { slug: true }
  })

  const postUrls = posts.map(post => ({
    loc: `/post/${post.slug}`,
    lastmod: post.updatedAt,
    changefreq: 'weekly',
    priority: 0.8
  }))

  const categoryUrls = categories.map(category => ({
    loc: `/category/${category.slug}`,
    changefreq: 'weekly',
    priority: 0.6
  }))

  return [
    {
      loc: '/',
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: '/search',
      changefreq: 'monthly',
      priority: 0.5
    },
    ...categoryUrls,
    ...postUrls
  ]
})