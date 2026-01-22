<template>
  <div>
    <UContainer class="py-8">
      <!-- 검색 헤더 -->
      <header class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          검색
        </h1>
        
        <!-- 검색 입력 -->
        <UInput
          v-model="searchQuery"
          placeholder="검색어를 입력하세요..."
          icon="i-heroicons-magnifying-glass"
          size="lg"
          autofocus
          @keyup.enter="handleSearch"
        />
      </header>

      <!-- 로딩 -->
      <div v-if="loading" class="space-y-4">
        <USkeleton v-for="i in 5" :key="i" class="h-32" />
      </div>

      <!-- 검색 결과 -->
      <div v-else-if="searchQuery && searched">
        <p class="text-sm text-gray-500 mb-6">
          "{{ searchQuery }}" 검색 결과 {{ posts.length }}건
        </p>

        <!-- 결과 목록 -->
        <div v-if="posts.length > 0" class="space-y-4">
          <UCard
            v-for="post in posts"
            :key="post.slug"
            :to="`/post/${post.slug}`"
            class="hover:ring-2 hover:ring-primary transition-all"
          >
            <div class="flex gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <UBadge :color="getCategoryColor(post.category.slug)" variant="subtle" size="sm">
                    {{ post.category.name }}
                  </UBadge>
                </div>
                <h2 class="font-semibold text-gray-900 dark:text-white mb-2">
                  {{ post.title }}
                </h2>
                <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {{ post.description }}
                </p>
                <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-eye" class="w-3 h-3" />
                    {{ post.viewCount.toLocaleString() }}
                  </span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 결과 없음 -->
        <div v-else class="text-center py-16">
          <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-2">검색 결과가 없습니다.</p>
          <p class="text-sm text-gray-400">다른 검색어로 시도해보세요.</p>
        </div>
      </div>

      <!-- 검색 전 상태 -->
      <div v-else class="text-center py-16">
        <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">검색어를 입력하세요.</p>
      </div>

      <!-- 인기 검색어 -->
      <div v-if="!searchQuery" class="mt-8">
        <h2 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          인기 검색어
        </h2>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="keyword in popularKeywords"
            :key="keyword"
            color="neutral"
            variant="soft"
            size="sm"
            @click="searchWithKeyword(keyword)"
          >
            {{ keyword }}
          </UButton>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getCategoryColor } from '~/types/types'
import { usePostStore } from '~/stores/post'

// SEO
useSeoMeta({
  title: '검색 - 생활정보 블로그',
  description: '금융, 연금, 보험 등 생활정보를 검색하세요.'
})

// Store
const postStore = usePostStore()
const { posts, loading } = storeToRefs(postStore)

// 검색어
const route = useRoute()
const searchQuery = ref((route.query.q as string) || '')
const searched = ref(false)

// 인기 검색어
const popularKeywords = [
  '압류방지통장',
  '새도약기금',
  '국민연금',
  '근로장려금',
  '실손보험',
  '퇴직연금'
]

// 검색 실행
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  searched.value = true
  await postStore.fetchPosts({
    search: searchQuery.value.trim(),
    limit: 20
  })
  
  // URL 업데이트
  navigateTo({
    path: '/search',
    query: { q: searchQuery.value }
  })
}

// 인기 검색어 클릭
const searchWithKeyword = async (keyword: string) => {
  searchQuery.value = keyword
  await handleSearch()
}

// URL에 검색어가 있으면 자동 검색
if (searchQuery.value) {
  await handleSearch()
}

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>