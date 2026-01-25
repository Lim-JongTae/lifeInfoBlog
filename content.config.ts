import { defineCollection, z } from '@nuxt/content'

export const collections = {
  docs: defineCollection({
    source: 'docs/**',
    type: 'page',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      image: z.string().optional(),
      date: z.string().optional(),
      tags: z.array(z.string()).optional()
    })
  })
}
