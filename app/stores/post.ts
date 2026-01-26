import { defineStore } from 'pinia'
import type { Post, PostsResponse, PostQueryParams } from '~/types/types'
 
export const usePostStore = defineStore('post', {
  state: () => ({
    posts: [] as Post[],
    currentPost: null as Post | null,
    total: 0,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchPosts(params?: {
      category?: string
      page?: number
      limit?: number
      search?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const query = new URLSearchParams()
        if (params?.category) query.set('category', params.category)
        if (params?.page) query.set('page', String(params.page))
        if (params?.limit) query.set('limit', String(params.limit))
        if (params?.search) query.set('search', params.search)

        const data = await $fetch<PostsResponse>(`/api/posts?${query}`)
        this.posts = data.posts
        this.total = data.total
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async fetchPost(slug: string) {
      this.loading = true
      this.error = null

      try {
        const post = await $fetch<Post>(`/api/posts/slug/${slug}`)
        this.currentPost = post

        // 조회수 증가 (비동기)
        $fetch('/api/stats/views', {
          method: 'POST',
          body: { slug }
        }).catch((e) => console.error ('View count error:', e))

        return post
      } catch (e: any) {
        this.error = e.message
        throw e
      } finally {
        this.loading = false
      }
    }
  }
})
