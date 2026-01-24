<template>
  <div>
    <UContainer class="py-8">
      <!-- 카테고리 헤더 -->
      <header class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <UIcon :name="category?.icon || 'i-heroicons-folder'" class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              {{ category?.name }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ category?.description }}
            </p>
          </div>
        </div>
        
        <div class="text-sm text-gray-500">
          총 {{ total }}개의 글
        </div>
      </header>

      <!-- 정렬 옵션 -->
      <div class="flex justify-between items-center mb-6">
        <div class="flex gap-2">
          <UButton
            v-for="sort in sortOptions"
            :key="sort.value"
            :color="currentSort === sort.value ? 'primary' : 'neutral'"
            :variant="currentSort === sort.value ? 'solid' : 'ghost'"
            size="sm"
            @click="changeSort(sort.value)"
          >
            {{ sort.label }}
          </UButton>
        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="space-y-4">
        <USkeleton v-for="i in 5" :key="i" class="h-32" />
      </div>

      <!-- 글 목록 -->
      <!-- 글 목록 -->
<div v-else-if="posts.length > 0" class="space-y-4">
  <NuxtLink
    v-for="post in posts"
    :key="post.slug"
    :to="`/post/${post.slug}`"
    class="block"
  >
    <UCard class="hover:ring-2 hover:ring-primary transition-all">
      <div class="flex gap-4">
        <div class="flex-1">
          <h2 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {{ post.title }}
          </h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {{ post.description }}
          </p>
          <div class="flex items-center gap-4 text-xs text-gray-500">
            <span class="flex items-center gap-1">
              <UIcon name="i-heroicons-eye" class="w-3 h-3" />
              {{ post.viewCount.toLocaleString() }}
                  </span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
            </div>
          </UCard>
        </NuxtLink>
      </div>

      <!-- 글이 없을 때 -->
      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">아직 작성된 글이 없습니다.</p>
      </div>

      <!-- 광고 영역 -->
       <!-- 글 목록 중간 -->
      <AdSense type="banner" slot="1234567895" />
      <div class="my-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg h-24 flex items-center justify-center text-gray-400">
        광고 영역 (AdSense)
      </div>

      <!-- 페이지네이션 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <UPagination
          v-model:page="currentPage"
          :total="total"
          :items-per-page="itemsPerPage"
          @update:page="changePage"
        />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/stores/category'
import { usePostStore } from '~/stores/post'

const route = useRoute()
const slug = route.params.slug as string

// Stores
const categoryStore = useCategoryStore()
const postStore = usePostStore()

const { posts, total, loading } = storeToRefs(postStore)

// 카테고리 정보 로드
await categoryStore.fetchCategories()
const category = computed(() => categoryStore.getBySlug(slug))

// SEO
useSeoMeta({
  title: () => `${category.value?.name || '카테고리'} - 생활정보 블로그`,
  description: () => category.value?.description || ''
})

// 정렬 옵션
const sortOptions = [
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' }
]
const currentSort = ref('latest')

// 페이지네이션
const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => {
  return Math.ceil(total.value / itemsPerPage)
})

// 데이터 로드
const loadPosts = async () => {
  await postStore.fetchPosts({
    category: slug,
    page: currentPage.value,
    limit: itemsPerPage
  })
}

// 초기 로드
await loadPosts()

// 정렬 변경
const changeSort = async (sort: string) => {
  currentSort.value = sort
  currentPage.value = 1
  await loadPosts()
}

// 페이지 변경
const changePage = async (page: number) => {
  currentPage.value = page
  await loadPosts()
}

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>