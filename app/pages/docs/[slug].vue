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

        <!-- 에러 -->
        <div v-else-if="error" class="text-center py-16">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p class="text-gray-500 mb-4">{{ error.message }}</p>
          <UButton to="/" color="primary">홈으로 돌아가기</UButton>
        </div>

        <!-- 문서 없음 -->
        <div v-else-if="!doc" class="text-center py-16">
          <UIcon name="i-heroicons-document-text" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p class="text-gray-500 mb-4">문서를 찾을 수 없습니다.</p>
          <UButton to="/" color="primary">홈으로 돌아가기</UButton>
        </div>

        <!-- 문서 내용 -->
        <template v-else>
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
              {{ doc.title }}
            </h1>

            <p v-if="doc.description" class="text-lg text-gray-600 dark:text-gray-400 mb-4">
              {{ doc.description }}
            </p>

            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <UIcon name="i-heroicons-github" class="w-4 h-4" />
                GitHub에서 관리됨
              </span>
            </div>
          </header>

          <USeparator class="mb-8" />

          <!-- 본문 -->
          <article class="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20">
            <div v-html="renderedHtml" />
          </article>
        </template>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const slug = route.params.slug as string

// GitHub 설정 (환경변수로 변경 가능)
const githubOwner = 'your-username' // 변경 필요
const githubRepo = 'your-repo' // 변경 필요

// GitHub에서 마크다운 가져오기
const { doc, pending, error } = await useGitHubDoc(
  githubOwner,
  githubRepo,
  `docs/${slug}.md`
)

// 마크다운을 HTML로 변환하여 렌더링
const renderedHtml = computed(async () => {
  if (!doc.value?.content) return ''

  try {
    // marked 라이브러리 설정
    const html = await marked.parse(doc.value.content)
    return html
  } catch (e) {
    console.error('마크다운 렌더링 오류:', e)
    return doc.value.content
  }
})
</script>
