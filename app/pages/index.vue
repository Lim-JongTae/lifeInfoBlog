<template>
  <div>
    <!-- Hero Section -->
    <section class="py-16 md:py-24 bg-linear-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-950">
      <UContainer>
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-sm sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            금융, 연금, 보험 정보를
            <span class="text-primary">한눈에</span>
          </h1>
          <p class="text-sm sm:text-lg text-gray-600 dark:text-gray-400 mb-8">
            압류방지통장, 새도약기금, 연금 수령 전략 등 실용적인 생활정보를 제공합니다.
          </p>
          
          <!-- 카테고리 버튼 -->
          <div class="flex flex-wrap justify-center gap-3">
            <UButton
              v-for="category in categoryStore.categories"
              :key="category.slug"
              :to="`/category/${category.slug}`"
              color="neutral"
              variant="soft"
              size="lg"
            >
              <UIcon :name="category.icon" class="w-4 h-4" />
              {{ category.name }}
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- 인기글 Section -->
    <section class="py-12">
      <UContainer>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            🔥 인기글
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="post in popularPosts"
            :key="post.slug"
            :to="`/post/${post.slug}`"
            class="block"
          >
            <UCard class="hover:ring-2 hover:ring-primary transition-all h-full">
              <template #header>
                <div class="flex items-center gap-2">
                  <UBadge :color="getCategoryColor(post.category.slug)" variant="subtle">
                    {{ post.category.name }}
                  </UBadge>
                </div>
              </template>

              <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {{ post.title }}
              </h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {{ post.description }}
              </p>

              <template #footer>
                <div class="flex items-center justify-between text-xs text-gray-400">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-heroicons-eye" class="w-3 h-3" />
                    {{ post.viewCount.toLocaleString() }}
                  </span>
                  <span>{{ formatDate(post.createdAt) }}</span>
                </div>
              </template>
            </UCard>
          </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- 광고 배너 영역 (AdSense 자리) -->
    <section class="py-4">
      <UContainer>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg h-24 flex items-center justify-center text-gray-400">
          광고 영역 (AdSense)
        </div>
      </UContainer>
    </section>

    <!-- 최신글 Section -->
    <section class="py-12">
      <UContainer>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            📝 최신글
          </h2>
            <NuxtLink
              v-for="post in recentPosts"
              :key="post.slug"
              :to="`/post/${post.slug}`"
              class="block"
            >
              <!-- <UCard class="hover:ring-2 hover:ring-primary transition-all h-full"> -->
                <!-- 내용 동일 -->
              <!-- </UCard> -->
            </NuxtLink>
          </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
              v-for="post in popularPosts"
              :key="post.slug"
              :to="`/post/${post.slug}`"
              class="block"
          >
            <UCard class="hover:ring-2 hover:ring-primary transition-all h-full">
               <template #header>
                <div class="flex items-center gap-2">
                  <UBadge :color="getCategoryColor(post.category.slug)" variant="subtle">
                   {{ post.category.name }}
                  </UBadge>
               </div>
              </template>
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {{ post.title }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ post.description }}
            </p>

            <template #footer>
              <div class="flex items-center justify-between text-xs text-gray-400">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-eye" class="w-3 h-3" />
                  {{ post.viewCount.toLocaleString() }}
                </span>
                <span>{{ formatDate(post.createdAt) }}</span>
              </div>
            </template>
          </UCard>
        </NuxtLink>
        </div>
      </UContainer>
    </section>

    <!-- 카테고리별 Section -->
    <section class="py-12 bg-gray-50 dark:bg-gray-900">
      <UContainer>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          📂 카테고리별 보기
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="category in categories"
            :key="category.slug"
            :to="`/category/${category.slug}`"
            class="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:ring-2 hover:ring-primary transition-all"
          >
            <div class="w-12 h-12 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <UIcon :name="category.icon" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">
                {{ category.name }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ category._count?.posts }}개 글
              </p>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';
import { usePostStore } from '~/stores/post';
import { getCategoryColor } from '~/types/types';

// SEO 메타 태그
useSeoMeta({
  title: '생활에 꼭필요한 정보 - 금융, 연금, 보험 정보',
  description: '압류방지통장, 새도약기금, 연금 수령 전략 등 실용적인 생활정보를 제공합니다.',
  ogTitle: '생활정보 블로그',
  ogDescription: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.',
  ogType: 'website',
  ogImage: '[og:/headset-infolife_1.png]'
})
// Stores
const categoryStore = useCategoryStore()
const postStore = usePostStore()

// 반응형
const { categories } = storeToRefs(categoryStore)
const { posts, loading } = storeToRefs(postStore)
//Data Loading
await categoryStore.fetchCategories()
await postStore.fetchPosts({ limit: 9 })



// 인기글 (조회수 기준 정렬)
const popularPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3)
})

// 최신글
const recentPosts = computed(() => {
  return posts.value.slice(0, 6)
})

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>