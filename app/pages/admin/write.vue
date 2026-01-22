<template>
  <div>
    <UContainer class="py-8">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-left"
            color="neutral"
            variant="ghost"
            to="/admin"
          />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            새 글 작성
          </h1>
        </div>
        <div class="flex gap-2">
          <UButton
            color="neutral"
            variant="outline"
            :loading="saving"
            @click="handleSave(false)"
          >
            임시저장
          </UButton>
          <UButton
            color="primary"
            :loading="saving"
            @click="handleSave(true)"
          >
            발행하기
          </UButton>
        </div>
      </div>

      <!-- 에러 메시지 -->
      <UAlert
        v-if="error"
        color="error"
        icon="i-heroicons-exclamation-triangle"
        class="mb-6"
        :close-button="{ onClick: () => error = '' }"
      >
        {{ error }}
      </UAlert>

      <!-- 작성 폼 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 메인 콘텐츠 -->
        <div class="lg:col-span-2 space-y-6">
          <UCard>
            <div class="space-y-4">
              <UFormField label="제목" required>
                <UInput
                  v-model="form.title"
                  placeholder="글 제목을 입력하세요"
                  size="lg"
                />
              </UFormField>

              <UFormField label="슬러그 (URL)" required>
                <UInput
                  v-model="form.slug"
                  placeholder="url-friendly-slug"
                  icon="i-heroicons-link"
                />
              </UFormField>

              <UFormField label="설명">
                <UTextarea
                  v-model="form.description"
                  placeholder="글에 대한 간단한 설명"
                  :rows="2"
                />
              </UFormField>
            </div>
          </UCard>

          <UCard>
            <template #header>
              <span class="font-semibold">본문</span>
            </template>
            <UTextarea
              v-model="form.content"
              placeholder="마크다운으로 작성하세요..."
              :rows="20"
              class="font-mono"
            />
          </UCard>
        </div>

        <!-- 사이드바 -->
        <div class="space-y-6">
          <UCard>
            <template #header>
              <span class="font-semibold">카테고리</span>
            </template>
            <USelect
              v-model="form.categoryId"
              :items="categoryOptions"
              placeholder="카테고리 선택"
            />
          </UCard>

          <UCard>
            <template #header>
              <span class="font-semibold">태그</span>
            </template>
            <UInput
              v-model="tagInput"
              placeholder="태그 입력 후 Enter"
              @keyup.enter="addTag"
            />
            <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
              <UBadge
                v-for="tag in form.tags"
                :key="tag"
                color="primary"
                variant="subtle"
              >
                {{ tag }}
                <UButton
                  icon="i-heroicons-x-mark"
                  color="primary"
                  variant="ghost"
                  size="xs"
                  class="ml-1 -mr-1"
                  @click="removeTag(tag)"
                />
              </UBadge>
            </div>
          </UCard>

          <!-- 미리보기 -->
          <UCard>
            <template #header>
              <span class="font-semibold">미리보기</span>
            </template>
            <div class="prose prose-sm dark:prose-invert max-w-none" v-html="previewContent" />
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/stores/category'

definePageMeta({
  middleware: 'auth'
})

const router = useRouter()
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

await categoryStore.fetchCategories()

// 폼 데이터
const form = ref({
  title: '',
  slug: '',
  description: '',
  content: '',
  categoryId: '',
  tags: [] as string[]
})

const tagInput = ref('')
const saving = ref(false)
const error = ref('')

// 카테고리 옵션
const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    label: c.name,
    value: c.id
  }))
})

// 제목 → 슬러그 자동 생성
watch(() => form.value.title, (title) => {
  if (!form.value.slug) {
    form.value.slug = title
      .toLowerCase()
      .replace(/[^a-z0-9가-힣\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)
  }
})

// 태그 추가
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

// 태그 삭제
const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

// 미리보기
const previewContent = computed(() => {
  if (!form.value.content) return '<p class="text-gray-400">본문을 입력하면 미리보기가 표시됩니다.</p>'
  
  let html = form.value.content
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
  
  return `<p>${html}</p>`
})

// 저장
const handleSave = async (published: boolean) => {
  error.value = ''

  // 유효성 검사
  if (!form.value.title.trim()) {
    error.value = '제목을 입력해주세요.'
    return
  }
  if (!form.value.slug.trim()) {
    error.value = '슬러그를 입력해주세요.'
    return
  }
  if (!form.value.categoryId) {
    error.value = '카테고리를 선택해주세요.'
    return
  }
  if (!form.value.content.trim()) {
    error.value = '본문을 입력해주세요.'
    return
  }

  saving.value = true
  try {
    await $fetch('/api/posts', {
      method: 'POST',
      body: {
        ...form.value,
        published
      }
    })

    router.push('/admin')
  } catch (e: any) {
    error.value = e.data?.message || '저장에 실패했습니다.'
  } finally {
    saving.value = false
  }
}
</script>