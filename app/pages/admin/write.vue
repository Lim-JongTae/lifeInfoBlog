<template>
  <div>
    <UContainer class="py-8">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          새 글 작성
        </h1>
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
            게시하기
          </UButton>
        </div>
      </div>

      <!-- 작성 폼 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 사이드바 (모바일에서 먼저 표시) -->
        <div class="order-1 lg:order-2 lg:col-span-1 space-y-6">
          <UCard>
            <template #header>
              <span class="font-semibold">카테고리</span>
            </template>
            <USelect
              v-model="form.categoryId"
              :items="categoryOptions"
              placeholder="카테고리 선택"
              class="w-full"
            />
            <p v-if="errors.categoryId" class="text-sm text-red-500 mt-2">{{ errors.categoryId }}</p>
          </UCard>

          <UCard>
            <template #header>
              <span class="font-semibold">태그</span>
            </template>
            <UInput
              v-model="tagInput"
              placeholder="태그 입력 후 Enter"
              class="w-full"
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
        </div>

        <!-- 메인 콘텐츠 -->
        <div class="order-2 lg:order-1 lg:col-span-3 space-y-6">
          <UCard>
            <div class="space-y-6">
              <UFormField label="제목" required :error="errors.title">
                <UInput
                  v-model="form.title"
                  placeholder="글 제목을 입력하세요"
                  size="lg"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="슬러그 (URL)" :error="errors.slug">
                <div class="flex gap-2">
                  <UInput
                    v-model="form.slug"
                    placeholder="자동 생성됩니다"
                    icon="i-heroicons-link"
                    class="flex-1"
                    readonly
                  />
                  <UButton
                    color="neutral"
                    variant="outline"
                    @click="generateSlug"
                  >
                    재생성
                  </UButton>
                </div>
                <template #hint>
                  <span class="text-xs text-gray-500">카테고리-날짜-순번 형식으로 자동 생성</span>
                </template>
              </UFormField>

              <UFormField label="설명" :error="errors.description">
                <UTextarea
                  v-model="form.description"
                  placeholder="글에 대한 간단한 설명 (SEO에 사용됩니다)"
                  :rows="3"
                  class="w-full"
                />
              </UFormField>
            </div>
          </UCard>

          <!-- Tiptap 에디터 -->
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <span class="font-semibold">본문</span>
                <span v-if="errors.content" class="text-sm text-red-500">{{ errors.content }}</span>
              </div>
            </template>
            <AdminTiptapEditor v-model="form.content" />
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/stores/category'
import { postSchema } from '~/schemas/post'
import { getZodError } from '~/utils/get-error'
import { getApiError } from '~/utils/get-error'

definePageMeta({
  layout: 'admin' as any,
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
const errors = ref<Record<string, string>>({})

// 카테고리 옵션
const categoryOptions = computed(() => {
  return categories.value.map(c => ({
    label: c.name,
    value: c.id
  }))
})

// 슬러그 자동 생성
const generateSlug = async () => {
  if (!form.value.categoryId) {
    errors.value.slug = '먼저 카테고리를 선택해주세요.'
    return
  }

  const category = categories.value.find(c => c.id === form.value.categoryId)
  if (!category) return

  // 오늘 날짜
  const today = new Date()
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

  // 순번 가져오기
  try {
    const { nextNumber } = await $fetch<{ nextNumber: number }>('/api/posts/next-number', {
      query: {
        category: category.slug,
        date: dateStr
      }
    })
    
    form.value.slug = `${category.slug}-${dateStr}-${String(nextNumber).padStart(3, '0')}`
    errors.value.slug = ''
  } catch (e) {
    console.error('Slug generation error:', e)
    // 기본 순번 001 사용
    form.value.slug = `${category.slug}-${dateStr}-001`
  }
}

// 카테고리 선택 시 슬러그 자동 생성
watch(() => form.value.categoryId, () => {
  if (form.value.categoryId && !form.value.slug) {
    generateSlug()
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

// 유효성 검사
const validate = (): boolean => {
  errors.value = {}
  
  const result = postSchema.safeParse(form.value)
  
  if (!result.success) {
    result.error.issues.forEach(err => {
      const field = err.path[0] as string
      if (!errors.value[field]) {
        errors.value[field] = err.message
      }
    })
    return false
  }
  
  return true
}

// 저장
const handleSave = async (published: boolean) => {
  // 슬러그가 없으면 자동 생성
  if (!form.value.slug) {
    await generateSlug()
  }

  if (!validate()) return

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
    const error = getApiError(e)
    alert(error.statusMessage)
  } finally {
    saving.value = false
  }
}
</script>