<template>
  <div>
    <UContainer class="py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 뒤로가기 + 카테고리 -->
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
          <UBadge :color="getCategoryColor(post.category)" variant="subtle" class="mb-4">
            {{ post.categoryName }}
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
              {{ post.date }}
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
            <ContentRenderer v-if="post.content" :value="post.content" />
            
            <!-- 임시 본문 (DB 연동 전) -->
            <div v-else>
              <h2 id="overview">개요</h2>
              <p>
                {{ post.title }}에 대한 상세 내용입니다. 
                이 글에서는 관련 정보를 자세히 알아보겠습니다.
              </p>
              
              <h2 id="eligibility">신청 자격</h2>
              <p>
                신청 자격 조건에 대해 설명합니다. 
                아래 조건을 충족하는 경우 신청이 가능합니다.
              </p>
              <ul>
                <li>조건 1: 해당 내용</li>
                <li>조건 2: 해당 내용</li>
                <li>조건 3: 해당 내용</li>
              </ul>
              
              <h2 id="how-to-apply">신청 방법</h2>
              <p>
                신청 방법은 다음과 같습니다.
              </p>
              <ol>
                <li>1단계: 필요 서류 준비</li>
                <li>2단계: 온라인 또는 오프라인 신청</li>
                <li>3단계: 심사 및 결과 확인</li>
              </ol>
              
              <h2 id="documents">필요 서류</h2>
              <p>
                신청 시 필요한 서류 목록입니다.
              </p>
              
              <h2 id="caution">주의사항</h2>
              <p>
                신청 전 반드시 확인해야 할 주의사항입니다.
              </p>
              
              <h2 id="faq">자주 묻는 질문</h2>
              <p>
                관련하여 자주 묻는 질문과 답변입니다.
              </p>
            </div>
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
              <div class="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-400">
                광고 영역
              </div>
            </div>
          </aside>
        </div>

        <USeparator class="my-8" />

        <!-- 이전/다음 글 -->
        <div class="flex justify-between gap-4">
          <UButton
            v-if="prevPost"
            :to="`/post/${prevPost.slug}`"
            color="neutral"
            variant="outline"
            class="flex-1 justify-start"
          >
            <template #leading>
              <UIcon name="i-heroicons-arrow-left" />
            </template>
            <div class="text-left">
              <div class="text-xs text-gray-500">이전 글</div>
              <div class="truncate">{{ prevPost.title }}</div>
            </div>
          </UButton>
          <div v-else class="flex-1" />
          
          <UButton
            v-if="nextPost"
            :to="`/post/${nextPost.slug}`"
            color="neutral"
            variant="outline"
            class="flex-1 justify-end"
          >
            <div class="text-right">
              <div class="text-xs text-gray-500">다음 글</div>
              <div class="truncate">{{ nextPost.title }}</div>
            </div>
            <template #trailing>
              <UIcon name="i-heroicons-arrow-right" />
            </template>
          </UButton>
          <div v-else class="flex-1" />
        </div>

        <!-- 관련 글 -->
        <section class="mt-12">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
            📚 관련 글
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UCard
              v-for="related in relatedPosts"
              :key="related.slug"
              :to="`/post/${related.slug}`"
              class="hover:ring-2 hover:ring-primary transition-all"
            >
              <h3 class="font-medium text-gray-900 dark:text-white line-clamp-2">
                {{ related.title }}
              </h3>
              <p class="text-sm text-gray-500 mt-2">
                {{ related.date }}
              </p>
            </UCard>
          </div>
        </section>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// 카테고리별 색상
const categoryColors = {
  finance: 'error',
  support: 'info',
  pension: 'success',
  insurance: 'secondary',
  tips: 'warning'
} as const

type CategoryKey = keyof typeof categoryColors

const getCategoryColor = (category: string) => {
  if (category in categoryColors) {
    return categoryColors[category as CategoryKey]
  }
  return 'neutral' as const
}

// 임시 글 데이터 (나중에 API에서 가져옴)
const postsData: Record<string, any> = {
  'anti-seizure-account-2025': {
    title: '압류방지통장 만드는 법 (2025년 최신)',
    description: '행복지킴이통장, 희망지킴이통장 신청 자격과 방법을 상세히 알려드립니다.',
    category: 'finance',
    categoryName: '금융위기탈출',
    viewCount: 15234,
    date: '2025.01.20',
    content: null
  },
  'new-start-fund-eligibility': {
    title: '새도약기금 신청자격 총정리',
    description: '2025년 새도약기금 신청 조건, 필요 서류, 신청 방법을 알아봅니다.',
    category: 'finance',
    categoryName: '금융위기탈출',
    viewCount: 12890,
    date: '2025.01.18',
    content: null
  },
  'national-pension-calculation': {
    title: '국민연금 예상수령액 조회 방법',
    description: '내 국민연금 얼마나 받을 수 있을까? 조회 방법과 수령액 늘리는 팁.',
    category: 'pension',
    categoryName: '연금가이드',
    viewCount: 11456,
    date: '2025.01.15',
    content: null
  }
}

// 현재 글 데이터
const post = computed(() => {
  return postsData[slug] || {
    title: '글을 찾을 수 없습니다',
    description: '',
    category: 'neutral',
    categoryName: '기타',
    viewCount: 0,
    date: '',
    content: null
  }
})

// SEO
useSeoMeta({
  title: () => `${post.value.title} - 생활정보 블로그`,
  description: () => post.value.description,
  ogTitle: () => post.value.title,
  ogDescription: () => post.value.description
})

// Breadcrumb
const breadcrumbItems = computed(() => [
  { label: '홈', to: '/' },
  { label: post.value.categoryName, to: `/category/${post.value.category}` },
  { label: post.value.title }
])

// 목차 (임시)
const tocItems = [
  { id: 'overview', text: '개요', depth: 2 },
  { id: 'eligibility', text: '신청 자격', depth: 2 },
  { id: 'how-to-apply', text: '신청 방법', depth: 2 },
  { id: 'documents', text: '필요 서류', depth: 2 },
  { id: 'caution', text: '주의사항', depth: 2 },
  { id: 'faq', text: '자주 묻는 질문', depth: 2 }
]

// 이전/다음 글 (임시)
const prevPost = { slug: 'new-start-fund-eligibility', title: '새도약기금 신청자격 총정리' }
const nextPost = { slug: 'national-pension-calculation', title: '국민연금 예상수령액 조회 방법' }

// 관련 글 (임시)
const relatedPosts = [
  { slug: 'new-start-fund-eligibility', title: '새도약기금 신청자격 총정리', date: '2025.01.18' },
  { slug: 'national-pension-calculation', title: '국민연금 예상수령액 조회 방법', date: '2025.01.15' },
  { slug: 'earned-income-tax-credit-2025', title: '근로장려금 신청 방법 (2025)', date: '2025.01.22' }
]
</script>