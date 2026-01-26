<template>
  <div>
    <UContainer class="py-8">
      <div class="max-w-4xl mx-auto">
        <!-- 로딩 -->
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-8 w-32" />
          <USkeleton class="h-12 w-full" />
          <USkeleton class="h-96 w-full mt-8" />
        </div>

        <!-- 문서 없음 -->
        <div v-else-if="!doc" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-4">문서를 찾을 수 없습니다.</p>
          <UButton to="/" color="primary">홈으로 돌아가기</UButton>
        </div>

        <!-- 문서 내용 -->
        <div v-else>
          <!-- 뒤로가기 -->
          <div class="flex items-center gap-2 mb-6">
            <UButton
              icon="i-heroicons-arrow-left"
              color="neutral"
              variant="ghost"
              size="sm"
              @click="$router.back()"
            />
          </div>        

          <!-- 헤더 -->
          <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ doc?.title }}
            </h1>

            <p v-if="doc?.description" class="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {{ doc?.description }}
            </p>
          </header>

          <USeparator class="mb-8" />

          <!-- 모바일: TOC 드롭다운 -->
          <div class="lg:hidden mb-6">
            <button
              @click="tocOpen = !tocOpen"
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-semibold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
            >
              목차
              <UIcon
                :name="tocOpen ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                class="w-5 h-5"
              />
            </button>
            <nav v-if="tocOpen" class="mt-3 border-l-2 border-gray-200 dark:border-gray-700 ml-2">
              <button
                v-for="item in doc?.body?.toc?.links"
                :key="item.id"
                :data-heading-id="item.id"
                @click="scrollToHeading(item.id)"
                class="w-full text-left block text-sm transition-all duration-200 border-l-2 "
                :class="[
                  item.depth === 3 ? 'pl-6' : 'pl-4',
                  activeHeadingId === item.id
                    ? 'text-primary font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                ]"
              >
                {{ item.text }}
              </button>
            </nav>
          </div>

          <!-- 모바일: 본문 -->
          <article
            ref="mobileArticleRef"
            class="lg:hidden prose dark:prose-invert max-w-none"
          >
            <ContentRenderer :value="doc" />
          </article>

          <!-- 데스크톱: 본문 + TOC 레이아웃 -->
          <div
            ref="containerRef"
            class="hidden lg:flex gap-0 overflow-hidden"
            :style="{ height: containerHeight }">
            <!-- 본문 -->
            <article
              ref="desktopArticleRef"
              class="prose dark:prose-invert max-w-none overflow-y-auto shrink-0 scrollbar-hide"
              style="flex: 0 0 80%"
            >
              <ContentRenderer :value="doc" />
              
            </article>

            <!-- TOC (데스크톱) -->
            <aside
              class="overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-4 shrink-0"
              style="flex: 0 0 20%"
            >
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4 sticky top-0 bg-inherit">
                목차
              </h3>
              <nav v-if="doc?.body?.toc?.links && doc?.body?.toc?.links.length > 0" class="border-l-2 border-gray-200 dark:border-gray-700">
                <button
                  v-for="item in doc.body.toc.links"
                  :key="item.id"
                  :data-heading-id="item.id"
                  @click="scrollToHeading(item.id)"
                  class="w-full text-left block text-sm transition-all duration-200"
                  :class="[
                    { 'pl-4': item.depth === 3 },
                    activeHeadingId === item.id
                      ? 'text-primary font-semibold bg-primary/10 px-2 py-1 rounded -mx-2'
                      : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                  ]"
                >
                  {{ item.text }}
                </button>
              </nav>
              <p v-else class="text-sm text-gray-400">목차가 없습니다.</p>
            </aside>
          </div>
          
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const normalizedSlug = Array.isArray(slug) ? slug.join('/') : (slug as string)
// Nuxt Content v3 방식으로 쿼리
const { data: doc, pending } = useAsyncData(
  `docs-${slug}`,
  // ( () => queryCollection('docs').path(`/docs/${normalizedSlug}`).first()
   () => queryCollection('content').path(`/docs/${slug}`).first()
)
// 참조
const containerRef = ref<HTMLElement | null>(null)
const desktopArticleRef = ref<HTMLElement | null>(null)
const mobileArticleRef = ref<HTMLElement | null>(null)
const containerHeight = ref('auto')

// 활성 heading 추적
const activeHeadingId = ref<string | null>(null)

// 모바일 TOC 드롭다운
const tocOpen = ref(false)

// Intersection Observer 관리
let observer: IntersectionObserver | null = null

// 목차 항목 클릭 시 스크롤
const scrollToHeading = (id: string) => {
  console.log('scrollToHeading:', id) // 디버깅

  // 데스크톱 article 우선, 없으면 전체 문서에서 검색
  let element: HTMLElement | null = null
  if (desktopArticleRef.value) {
    element = desktopArticleRef.value.querySelector(`#${id}`)
  }
  if (!element) {
    element = document.getElementById(id)
  }

  console.log('found element:', element) // 디버깅

  if (element) {
    // 즉시 활성 상태 업데이트 (목차 클릭 시 바로 하이라이트)
    activeHeadingId.value = id

    window.history.pushState(null, '', `#${id}`)

    // 스크롤: 현재 화면에 맞게
    const isDesktop = window.innerWidth >= 1024
    if (isDesktop && desktopArticleRef.value) {
      const articleRect = desktopArticleRef.value.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const offsetTop = elementRect.top - articleRect.top + desktopArticleRef.value.scrollTop - 80
      desktopArticleRef.value.scrollTo({ top: offsetTop, behavior: 'smooth' })
    } else if (!isDesktop && mobileArticleRef.value) {
      const articleRect = mobileArticleRef.value.getBoundingClientRect()
      const elementRect = element.getBoundingClientRect()
      const offsetTop = elementRect.top - articleRect.top + mobileArticleRef.value.scrollTop - 50
      mobileArticleRef.value.scrollTo({ top: offsetTop, behavior: 'smooth' })
    } else {
      // fallback: window 스크롤
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // 모바일에서 드롭다운 닫기
    tocOpen.value = false
  }
}

// TOC 자동 스크롤: 활성 항목이 TOC 영역 밖으로 나가면 중앙으로 스크롤
watch(
  () => activeHeadingId.value,
  (newId) => {
    if (!newId) return

    nextTick(() => {
      // 활성 TOC 버튼 찾기
      const activeButton = document.querySelector(`button[data-heading-id="${newId}"]`)
      if (!activeButton) return

      // TOC aside 찾기
      const tocAside = document.querySelector('aside.overflow-y-auto')
      if (!tocAside) return

      // 버튼이 aside 영역 안에 있는지 확인
      const asideRect = tocAside.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()

      // 버튼이 visible 범위 밖이면 스크롤
      if (buttonRect.top < asideRect.top || buttonRect.bottom > asideRect.bottom) {
        activeButton.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
  }
)

// 문서 로드 완료 후 해시 감시
watch(
  () => pending.value,
  (isPending) => {
    if (!isPending && route.hash) {
      const id = route.hash.slice(1) // '#' 제거
      console.log('watch pending:', id, route.hash) // 디버깅
      // 렌더링 완료 대기
      nextTick(() => {
        setTimeout(() => {
          console.log('calling scrollToHeading from watch:', id) // 디버깅
          scrollToHeading(id)
        }, 200)
      })
    }
  }
)

// Intersection Observer 설정
onMounted(() => {
  if (process.client) {
    // 데스크톱: 컨테이너 높이를 화면에 맞추기
    const isDesktop = window.innerWidth >= 1024
    if (isDesktop) {
      containerHeight.value = `${window.innerHeight - 300}px`
    }

    // 초기 해시가 있으면 해당 위치로 스크롤
    if (route.hash) {
      const id = route.hash.slice(1) // '#' 제거
      nextTick(() => {
        scrollToHeading(id)
      })
    }

    // Intersection Observer: 스크롤 시 현재 heading 추적
    nextTick(() => {
  setTimeout(() => {
    const currentArticle = isDesktop ? desktopArticleRef.value : mobileArticleRef.value
    const headings = currentArticle
      ? currentArticle.querySelectorAll<HTMLElement>('h2[id], h3[id]')
      : []

    console.log('Observing headings:', headings.length)

    if (headings.length === 0) return

    observer = new IntersectionObserver((entries) => {
      // 화면에 보이는 heading 중 가장 상단 것 선택
      const visibleEntries = entries.filter(e => e.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // boundingClientRect.top이 가장 작은 (가장 위에 있는) heading
        const topEntry = visibleEntries.reduce((prev, curr) => 
          prev.boundingClientRect.top < curr.boundingClientRect.top ? prev : curr
        )
        
        const headingElement = topEntry.target as HTMLElement
        if (headingElement.id) {
          activeHeadingId.value = headingElement.id
        }
      }
    }, {
      root: currentArticle,
      rootMargin: '-80px 0px -60% 0px',
      threshold: [0, 0.5, 1]
    })

    headings.forEach((heading) => {
      observer?.observe(heading)
    })
  }, 300)
})

    // 윈도우 리사이즈 감시
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024
      if (isDesktop) {
        containerHeight.value = `${window.innerHeight - 300}px`
      } else {
        containerHeight.value = 'auto'
      }
    }

    window.addEventListener('resize', handleResize)

    // 정리 함수를 onUnmounted에 저장
    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      if (observer) {
        observer.disconnect()
      }
    })
  }
})
useSeoMeta({
  title: doc.value?.title,
  description: doc.value?.description
})


</script>
<style>

.scrollbar-hide {
  /* Firefox */
  scrollbar-width: none;
  /* IE, Edge */
  -ms-overflow-style: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

</style>