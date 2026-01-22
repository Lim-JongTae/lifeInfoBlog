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
              v-for="category in categories"
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
          <UCard
            v-for="post in popularPosts"
            :key="post.slug"
            :to="`/post/${post.slug}`"
            class="hover:ring-2 hover:ring-primary transition-all"
          >
            <template #header>
              <div class="flex items-center gap-2">
                <UBadge :color="getCategoryColor(post.category)" variant="subtle">
                  {{ post.categoryName }}
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
                <span>{{ post.date }}</span>
              </div>
            </template>
          </UCard>
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
          <UButton
            to="/posts"
            color="neutral"
            variant="ghost"
            trailing-icon="i-heroicons-arrow-right"
          >
            전체보기
          </UButton>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="post in recentPosts"
            :key="post.slug"
            :to="`/post/${post.slug}`"
            class="hover:ring-2 hover:ring-primary transition-all"
          >
            <template #header>
              <UBadge :color="getCategoryColor(post.category)" variant="subtle">
                {{ post.categoryName }}
              </UBadge>
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
                <span>{{ post.date }}</span>
              </div>
            </template>
          </UCard>
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
                {{ category.count }}개 글
              </p>
            </div>
          </NuxtLink>
        </div>
      </UContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO 메타 태그
useSeoMeta({
  title: '생활에 꼭필요한 정보 - 금융, 연금, 보험 정보',
  description: '압류방지통장, 새도약기금, 연금 수령 전략 등 실용적인 생활정보를 제공합니다.',
  ogTitle: '생활정보 블로그',
  ogDescription: '금융, 연금, 보험 등 실용적인 생활정보를 제공합니다.',
  ogType: 'website',
  ogImage: '[og:/lifeinfo.svg]'
})

// 카테고리 데이터
const categories = [
  { slug: 'finance', name: '금융위기탈출', icon: 'i-heroicons-banknotes', count: 12 },
  { slug: 'support', name: '정부지원금', icon: 'i-heroicons-hand-raised', count: 8 },
  { slug: 'pension', name: '연금가이드', icon: 'i-heroicons-calculator', count: 15 },
  { slug: 'insurance', name: '보험정보', icon: 'i-heroicons-shield-check', count: 10 },
  { slug: 'tips', name: '생활꿀팁', icon: 'i-heroicons-light-bulb', count: 20 }
]

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

// 임시 인기글 데이터 (나중에 API에서 가져옴)
const popularPosts = [
  {
    slug: 'anti-seizure-account-2025',
    title: '압류방지통장 만드는 법 (2025년 최신)',
    description: '행복지킴이통장, 희망지킴이통장 신청 자격과 방법을 상세히 알려드립니다.',
    category: 'finance',
    categoryName: '금융위기탈출',
    viewCount: 15234,
    date: '2025.01.20'
  },
  {
    slug: 'new-start-fund-eligibility',
    title: '새도약기금 신청자격 총정리',
    description: '2025년 새도약기금 신청 조건, 필요 서류, 신청 방법을 알아봅니다.',
    category: 'finance',
    categoryName: '금융위기탈출',
    viewCount: 12890,
    date: '2025.01.18'
  },
  {
    slug: 'national-pension-calculation',
    title: '국민연금 예상수령액 조회 방법',
    description: '내 국민연금 얼마나 받을 수 있을까? 조회 방법과 수령액 늘리는 팁.',
    category: 'pension',
    categoryName: '연금가이드',
    viewCount: 11456,
    date: '2025.01.15'
  }
]

// 임시 최신글 데이터
const recentPosts = [
  {
    slug: 'earned-income-tax-credit-2025',
    title: '근로장려금 신청 방법 (2025)',
    description: '근로장려금 자격 조건과 신청 방법, 지급일정을 알아봅니다.',
    category: 'support',
    categoryName: '정부지원금',
    viewCount: 3421,
    date: '2025.01.22'
  },
  {
    slug: 'retirement-pension-comparison',
    title: '퇴직연금 DB vs DC 뭐가 좋을까?',
    description: 'DB형과 DC형 퇴직연금의 차이점과 선택 기준을 비교합니다.',
    category: 'pension',
    categoryName: '연금가이드',
    viewCount: 2890,
    date: '2025.01.21'
  },
  {
    slug: 'health-insurance-claim',
    title: '실손보험 청구 방법 (간편 청구)',
    description: '실손의료보험 청구 서류와 간편 청구 앱 사용법을 알아봅니다.',
    category: 'insurance',
    categoryName: '보험정보',
    viewCount: 2456,
    date: '2025.01.20'
  },
  {
    slug: 'phone-bill-save-tips',
    title: '통신비 월 3만원 아끼는 방법',
    description: '알뜰폰, 결합할인 등 통신비 절약 꿀팁을 정리했습니다.',
    category: 'tips',
    categoryName: '생활꿀팁',
    viewCount: 2234,
    date: '2025.01.19'
  },
  {
    slug: 'housing-benefit-guide',
    title: '주거급여 신청 자격 및 방법',
    description: '주거급여 대상자 조건과 신청 절차를 안내합니다.',
    category: 'support',
    categoryName: '정부지원금',
    viewCount: 1987,
    date: '2025.01.18'
  },
  {
    slug: 'car-insurance-comparison',
    title: '자동차보험 갱신 할인 받는 법',
    description: '자동차보험 갱신 시 할인 받는 방법과 비교 사이트 활용법.',
    category: 'insurance',
    categoryName: '보험정보',
    viewCount: 1756,
    date: '2025.01.17'
  }
]
</script>