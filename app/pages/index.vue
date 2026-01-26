
<template>
  <div>
    <!-- 로딩 상태 -->
    <div v-if="loading" class="py-12">
      <UContainer>
        <div class="space-y-4">
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-96 w-full" />
        </div>
      </UContainer>
    </div>

    <!-- Hero Section -->
    <section v-else class="relative py-16 md:py-24 bg-cover bg-center">
      <!-- 구름 레이어 -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <img 
          src="/202601242116.gif" 
          alt="" 
          class="absolute w-[200%] h-full object-cover opacity-80"
        />
      </div>
      
      <!-- 콘텐츠 -->
      <UContainer class="relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-sm sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            금융, 연금, 보험 정보를
            <span class="text-primary">한눈에</span>
          </h1>
          <p class="text-sm sm:text-lg text-gray-50 dark:text-gray-50 mb-8">
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
              size="sm" 
            >
              <UIcon :name="category.icon" class="w-4 h-4" />
              {{ category.name }}
            </UButton>
          </div>
        </div>
      </UContainer>
    </section>
    <!-- 인기글 Section -->
    <section v-if="!loading && popularPosts.length > 0" class="py-12">
      <UContainer>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            🔥 인기글
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="post in popularPosts"
            :key="post.slug"
            class="block cursor-pointer"
            @click="$router.push(`/post/${post.slug}`)"
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
          </div>
          
        </div>
        
      </UContainer>
    </section>

    <!-- 광고 배너 영역 (AdSense 자리) -->
    <section v-if="!loading" class="py-4">
      <UContainer>
        <AdSense type="banner" slot="1234567890" />
      </UContainer>
    </section>

    <!-- 최신글 Section -->
    <section v-if="!loading && recentPosts.length > 0" class="py-12">
      <UContainer>
        <div class="mb-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            📝 최신글
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
              v-for="post in recentPosts"
              :key="post.slug"
              class="block cursor-pointer"
              @click="$router.push(`/post/${post.slug}`)"
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
        </div>
        </div>
      </UContainer>
    </section>
    <!-- 최신글 섹션 아래 -->
    <div v-if="!loading" class="py-4">
      <UContainer>
        <AdSense type="banner" slot="1234567891" />
      </UContainer>
    </div>

    <!-- 카테고리별 Section -->
    <section v-if="!loading && categories.length > 0" class="py-12 bg-gray-50 dark:bg-gray-900">
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
    <section>
      <UContainer class="py-8">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          문서 목록
        </h1>

        <!-- 검색 -->
        <UInput
          v-model="docsSearch"
          placeholder="문서 제목 검색..."
          icon="i-heroicons-magnifying-glass"
          size="sm"
          class="w-64"
        />
      </div>

      <!-- 로딩 상태 -->
      <div v-if="pending" class="space-y-3">
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-10 w-full" />
      </div>

      <!-- 목록 -->
      <UCard v-else>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Docs</h2>
            <div class="text-sm text-gray-500">
              총 {{ totalCount }}건
            </div>
          </div>
        </template>

        <ul v-if="docsFiltered.length > 0" class="divide-y divide-gray-200 dark:divide-gray-800">
          <li
            v-for="item in docsFiltered"
            :key="item.path"
            class="py-3"
          >
            <NuxtLink
              :to="`/docs/${getSlug(item.path)}`"
              class="flex items-baseline justify-between hover:text-primary"
            >
              <span class="font-medium truncate">{{ item.title || item.path }}</span>
              <span class="ml-3 shrink-0 text-sm text-gray-500 dark:text-gray-400">
                조회수 {{ getViewCount(item) }} · {{ formatDate(item.date) }}
              </span>
            </NuxtLink>
          </li>
        </ul>

        <div v-else class="text-center py-10 text-gray-500">
          문서가 없습니다.
        </div>

        <!-- 페이지네이션 -->
        <template #footer>
          <div class="flex items-center justify-center gap-3">
            <UButton
              :disabled="page <= 1"
              color="neutral"
              variant="soft"
              @click="goPrev()"
            >
              이전
            </UButton>

            <span class="text-sm text-gray-500">
              {{ page }} / {{ totalPages }}
            </span>

            <UButton
              :disabled="page >= totalPages"
              color="neutral"
              variant="soft"
              @click="goNext()"
            >
              다음
            </UButton>
          </div>
        </template>
      </UCard>
    </UContainer>
    </section>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCategoryStore } from '~/stores/category';
import { getCategoryColor } from '~/types/types';
import { usePostStore } from '~/stores/post' // 조회수 집계

// SEO 메타 태그
useSeoMeta({
  title: '생활에 꼭필요한 정보 - 금융, 연금, 보험 정보',
  description: '압류방지통장, 새도약기금, 연금 수령 전략 등 실용적인 생활정보를 제공합니다.',
  ogTitle: '생활정보 블로그',
  ogDescription: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.',
  ogType: 'website',
  ogImage: '/lifeinfo.png'
})
// Stores
const categoryStore = useCategoryStore()
const postStore = usePostStore()
const { posts, loading } = storeToRefs(postStore)
const route = useRoute()
const router = useRouter()

/** 날짜 포맷 유틸: YYYY.MM.DD (안전 가드 포함) */
const formatDate = (date?: string | number | Date) => {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}.${mm}.${dd}`
}
// 반응형
const { categories } = storeToRefs(categoryStore)
//Data Loading
await categoryStore.fetchCategories()
await postStore.fetchPosts({ limit: 9 })

// 인기글 (조회수 기준 정렬)
const popularPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3)
})
/** ===== 목록/검색/페이지네이션 상태 ===== */

// 최신글 (생성일 기준 내림차순 정렬)
const recentPosts = computed(() => {
  return [...posts.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
})


// page는 쿼리스트링 ?page= 로 유지 (새로고침/공유 시 편리)
const page = computed({
  get: () => Number(route.query.page ?? 1),
  set: (v: number) => router.replace({ query: { ...route.query, page: String(v) } })
})
const pageSize = 10
const offset = computed(() => (page.value - 1) * pageSize)

const docsSearch = ref('')

// ===== 목록 로드 (path LIKE '/docs/%') =====
// v3의 쿼리빌더는 .where('필드','LIKE','패턴')을 지원합니다. [1](https://content.nuxt.com/docs/utils/query-collection)
const { data: items, pending, refresh } = await useAsyncData(
  () => `docs-list-${page.value}-${docsSearch.value}`,
  () => {
    const q = queryCollection('content') // 기본 content 컬렉션
      .select('path', 'title', 'date')
      .where('path', 'LIKE', '/docs/%')
      .order('date', 'DESC')
      .skip(offset.value)
      .limit(pageSize)

    return q.all()
  }
)

// 총 개수
const { data: total } = await useAsyncData<number>(
  () => `docs-total-${docsSearch.value}`,
  () => queryCollection('content')
      .where('path', 'LIKE', '/docs/%')
      .count(),
      { default: () => 0 }
)


// 안전한 파생 상태
const totalCount = computed(() => total.value ?? 0)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize)))


// 간단 클라이언트 검색(제목에 한정)
const docsFiltered = computed(() => {
  const list = items.value ?? []
  const s = docsSearch.value.trim().toLowerCase()
  if (!s) return list
  return list.filter(d => (d.title ?? '').toLowerCase().includes(s))
})

// 검색어 변경 시 1페이지로 이동 + 새로고침
watch(() => docsSearch.value, () => {
  page.value = 1
  refresh()
})

// 페이지 버튼
const goPrev = () => { page.value = Math.max(1, page.value - 1) }
const goNext = () => { page.value = Math.min(totalPages.value, page.value + 1) }

/** ===== 조회수 표시 (예시) ===== */


// 목록에 보일 때도 viewCount를 쓰려면 미리 로드
await postStore.fetchPosts({ limit: 1000 })

const getSlug = (path: string) => path.replace(/^\/docs\//, '')

  const getViewCount = (item: { path: string }) => {
  const slug = getSlug(item.path)
  const found = posts.value.find(p => p.slug === slug)
  return found?.viewCount ?? 0
}

</script>
