<template>
  <div>
    <UContainer class="py-8">
      <!-- 로딩 -->
      <div v-if="loading" class="space-y-4">
        <USkeleton class="h-10 w-64" />
        <USkeleton class="h-96 w-full" />
      </div>

      <template v-else-if="form">
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
              글 수정
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
                    class="block"
                  />
                </UFormField>

                <UFormField label="슬러그 (URL)" required>
                  <UInput
                    v-model="form.slug"
                    class="block"
                    placeholder="url-friendly-slug"
                    icon="i-heroicons-link"
                  />
                </UFormField>

                <UFormField label="설명">
                  <UTextarea
                    v-model="form.description"
                    class="block"
                    placeholder="글에 대한 간단한 설명 (SEO에 사용됩니다)"
                    :rows="2"
                  />
                </UFormField>
              </div>
            </UCard>

            <!-- Tiptap 에디터 -->
            <UCard>
              <template #header>
                <span class="font-semibold">본문</span>
              </template>
              <AdminTiptapEditor v-model="form.content" />
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

            <UCard>
              <template #header>
                <span class="font-semibold">상태</span>
              </template>
              <div class="flex items-center gap-2">
                <UBadge :color="form.published ? 'success' : 'warning'" variant="subtle">
                  {{ form.published ? '발행됨' : '임시저장' }}
                </UBadge>
              </div>
            </UCard>
          </div>
        </div>
      </template>

      <!-- 글 없음 -->
      <div v-else class="text-center py-16">
        <p class="text-gray-500 mb-4">글을 찾을 수 없습니다.</p>
        <UButton to="/admin" color="primary">목록으로</UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/stores/category'
import type { Post } from '~/types/types'

definePageMeta({
  layout: 'admin' as any,
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

await categoryStore.fetchCategories()

// 상태
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const tagInput = ref('')

const form = ref<{
  title: string
  slug: string
  description: string
  content: string
  categoryId: string
  tags: string[]
  published: boolean
} | null>(null)

// 데이터 로드
const loadPost = async () => {
  try {
    const { posts } = await $fetch<{ posts: Post[] }>('/api/posts', {
      query: { published: 'all', limit: 100 }
    })
    
    const post = posts.find(p => p.id === id)
    
    if (post) {
      form.value = {
        title: post.title,
        slug: post.slug,
        description: post.description || '',
        content: post.content,
        categoryId: post.categoryId,
        tags: post.tags || [],
        published: post.published
      }
    }
  } catch (e) {
    console.error('Load error:', e)
  } finally {
    loading.value = false
  }
}

await loadPost()

// 카테고리 옵션
const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    label: c.name,
    value: c.id
  }))
})

// 태그 추가
const addTag = () => {
  if (!form.value) return
  const tag = tagInput.value.trim()
  if (tag && !form.value.tags.includes(tag)) {
    form.value.tags.push(tag)
  }
  tagInput.value = ''
}

// 태그 삭제
const removeTag = (tag: string) => {
  if (!form.value) return
  form.value.tags = form.value.tags.filter(t => t !== tag)
}

// 저장
const handleSave = async (published: boolean) => {
  if (!form.value) return
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
    await $fetch(`/api/posts/${id}`, {
      method: 'PUT',
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