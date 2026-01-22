import { defineStore } from 'pinia'
import type { Category } from '~/types/types'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [] as Category[],
    loading: false
  }),

  getters: {
    getBySlug: (state) => (slug: string) => {
      return state.categories.find(c => c.slug === slug)
    }
  },

  actions: {
    async fetchCategories() {
      if (this.categories.length > 0) return

      this.loading = true
      try {
        const data = await $fetch<Category[]>('/api/categories')
        this.categories = data
      } finally {
        this.loading = false
      }
    }
  }
})