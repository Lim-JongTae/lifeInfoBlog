<template>
    <div>
    <!-- SEO -->
    <SeoHead
      v-if="post"
      :title="`${post.title} - 생활정보 블로그`"
      :description="post.description || ''"
      type="article"
      :published-at="post.createdAt"
      :modified-at="post.updatedAt"
    />
    
    <!-- 나머지 내용... -->
  </div>

  <div>
    <UContainer class="py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 로딩 -->
        <div v-if="loading" class="space-y-4">
          <USkeleton class="h-8 w-32" />
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-6 w-2/3" />
          <USkeleton class="h-96 w-full mt-8" />
        </div>

        <!-- 글 없음 -->
        <div v-else-if="!post" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-4">게시글을 찾을 수 없습니다.</p>
          <UButton to="/" color="primary">홈으로 돌아가기</UButton>
        </div>

        <!-- 글 내용 -->
        <template v-else>
          <!-- 뒤로가기 + Breadcrumb -->
          <div class="flex items-center gap-2 mb-6">
            <UButton
              icon="i-heroicons-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="$router.back()"
            />
            <UBreadcrumb :items="breadcrumbItems" />
          </div>

          <!-- 글 헤더 -->
          <header class="mb-8">
            <UBadge :color="getCategoryColor(post.category.slug)" variant="subtle" class="mb-4">
              {{ post.category.name }}
            </UBadge>
            
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ post.title }}
            </h1>
            
            <p class="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {{ post.description }}
            </p>
            
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                {{ formatDate(post.createdAt) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                {{ post.viewCount.toLocaleString() }}
              </span>
            </div>
          </header>

          <USeparator class="mb-8" />

          <!-- 본문 + TOC 레이아웃 -->
          <div class="flex gap-8">
            <!-- 본문 -->
            <article class="flex-1 prose prose-lg dark:prose-invert max-w-none">
              <div v-html="renderedContent" />
            </article>

            <!-- TOC (데스크톱) -->
            <aside class="hidden lg:block w-64 shrink-0">
              <div class="sticky top-24">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  목차
                </h3>
                <nav class="space-y-2">
                  <a
                    v-for="item in tocItems"
                    :key="item.id"
                    :href="`#${item.id}`"
                    class="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    :class="{ 'pl-4': item.depth === 3 }"
                  >
                    {{ item.text }}
                  </a>
                </nav>
                
                <!-- 광고 영역 -->
                <AdSense type="in-article" slot="1234567892" />
                <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-400">
                  광고 영역
                </div>
              </div>
            </aside>
          </div>

          <USeparator class="my-8" />

          <!-- 태그 -->
          <div v-if="post.tags && post.tags.length > 0" class="mb-8">
            <div class="flex flex-wrap gap-2">
              <UBadge
                v-for="tag in post.tags"
                :key="tag"
                color="neutral"
                variant="subtle"
              >
                #{{ tag }}
              </UBadge>
            </div>
          </div>

          <!-- 이전/다음 글 -->
          <div class="sm:justify-between sm:gap-4 sm:flex space-x-1 space-y-1 textce">
            <UButton
              v-if="surroundPosts.prev"
              :to="`/post/${surroundPosts.prev.slug}`"
              color="neutral"
              variant="outline"
              class="flex-1 justify-start hover:-translate-y-1 hover:scale-110"
            >
              <template #leading>
                <UIcon name="i-heroicons-arrow-left" />
              </template>
              <div class="text-left">
                <div class="text-xs text-gray-500">이전 글</div>
                <div class="truncate">{{ surroundPosts.prev.title }}</div>
              </div>
            </UButton>
            <div v-else class="flex-1" />
            
            <UButton
              v-if="surroundPosts.next"
              :to="`/post/${surroundPosts.next.slug}`"
              color="neutral"
              variant="outline"
              class="flex-1 justify-end"
            >
              <div class="text-right transform transition hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ">
                <div class="text-xs text-gray-500">다음 글</div>
                <div class="truncate">{{ surroundPosts.next.title }}</div>
              </div>
              <template #trailing>
                <UIcon name="i-heroicons-arrow-right" />
              </template>
            </UButton>
            <div v-else class="flex-1" />
          </div>
          <!--광고-->
          <AdSense type="sidebar" slot="1234567893" />
          <!-- 관련 글 -->
          <section v-if="relatedPosts.length > 0" class="mt-12">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
              📚 관련 글
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <NuxtLink
                v-for="related in relatedPosts"
                :key="related.slug"
                :to="`/post/${related.slug}`"
                class="block"
              >
                <UCard class="hover:ring-2 hover:ring-primary transition-all h-full">
                  <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">
                    {{ related.title }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-2">
                    {{ formatDate(related.createdAt) }}
                  </p>
                </UCard>
              </NuxtLink>
            </div>
          </section>
        </template>
      </div>
      <!--광고-->
      <AdSense type="rectangle" slot="1234567894" />
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { getCategoryColor } from '~/types/types'
import { usePostStore } from '~/stores/post'
import type { Post } from '~/types/types'

const route = useRoute()
const slug = route.params.slug as string

// Store
const postStore = usePostStore()
const { currentPost: post, loading } = storeToRefs(postStore)

// 데이터 로드
await postStore.fetchPost(slug)

// SEO
useSeoMeta({
  title: () => post.value ? `${post.value.title} - 생활정보 블로그` : '게시글',
  description: () => post.value?.description || '',
  ogTitle: () => post.value?.title || '',
  ogDescription: () => post.value?.description || ''
})

// Breadcrumb
const breadcrumbItems = computed(() => {
  if (!post.value) return []
  return [
    { label: '홈', to: '/' },
    { label: post.value.category.name, to: `/category/${post.value.category.slug}` },
    { label: post.value.title }
  ]
})

// 마크다운 → HTML 변환 (간단 버전)
const renderedContent = computed(() => {
  if (!post.value?.content) return ''
  
  let html = post.value.content
    // 헤딩
    .replace(/^### (.*$)/gim, '<h3 id="$1">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 id="$1">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 id="$1">$1</h1>')
    // 리스트
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    // 굵게, 기울임
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // 줄바꿈
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
  
  return `<p>${html}</p>`
})

// 목차 추출
const tocItems = computed(() => {
  if (!post.value?.content) return []
  
  const items: { id: string; text: string; depth: number }[] = []
  const regex = /^(#{2,3}) (.+)$/gm
  let match
  
  while ((match = regex.exec(post.value.content)) !== null) {
    const depth = match[1]?.length || 2
    const text = match[2]?.trim() || ''
    
    if (text) {
      items.push({
        id: text,
        text: text,
        depth: depth
      })
    }
  }
  
  return items
})

// 이전/다음 글 (같은 카테고리)
const surroundPosts = ref<{ prev: Post | null | undefined; next: Post | null | undefined }>({
  prev: null,
  next: null
})

// 관련 글 (같은 카테고리)
const relatedPosts = ref<Post[]>([])

// 관련 글 로드
const loadRelatedPosts = async () => {
  if (!post.value) return
  
  const { posts } = await $fetch<{ posts: Post[] }>('/api/posts', {
    query: {
      category: post.value.category.slug,
      limit: 4
    }
  })
  
  // 현재 글 제외
  const filtered = posts.filter(p => p.slug !== slug)
  relatedPosts.value = filtered.slice(0, 3)
  
  // 이전/다음 글 설정
  const currentIndex = posts.findIndex(p => p.slug === slug)
  if (currentIndex > 0) {
    surroundPosts.value.next = posts[currentIndex - 1]
  }
  if (currentIndex < posts.length - 1) {
    surroundPosts.value.prev = posts[currentIndex + 1]
  }
}

await loadRelatedPosts()

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>