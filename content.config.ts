import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: {
        repository: 'https://github.com/Lim-JongTae/lifeInfoBlog',
        include:'content/docs/**/*.md',
        prefix: '/docs'
      },
     
      schema: z.object({
        title: z.string(),
        slug: z.string(),
        content: z.string(),
        description: z.string().optional(),
        image: z.string().optional(),
        date: z.string().optional(),
        published: z.boolean().optional(),
        veiw_count: z.number(),
        created_at: z.date().optional(),
        updated_at: z.date().optional(),
        tags: z.array(z.string()).optional()
      })

    })
  }
})
// type: 'page',
//       source: '**/*.md',
 // 


      