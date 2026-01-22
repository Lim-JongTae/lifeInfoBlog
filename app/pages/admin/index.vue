<template>
  <div>
    <UContainer class="py-8">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          관리자 대시보드
        </h1>
        <div class="flex gap-2">
          <UButton
            to="/admin/write"
            color="primary"
            icon="i-heroicons-plus"
          >
            새 글 작성
          </UButton>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            @click="handleLogout"
          >
            로그아웃
          </UButton>
        </div>
      </div>

      <!-- 통계 카드 -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-primary">{{ stats.totalPosts }}</p>
            <p class="text-sm text-gray-500">전체 글</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-green-500">{{ stats.publishedPosts }}</p>
            <p class="text-sm text-gray-500">발행됨</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-yellow-500">{{ stats.draftPosts }}</p>
            <p class="text-sm text-gray-500">임시저장</p>
          </div>
        </UCard>
        <UCard>
          <div class="text-center">
            <p class="text-3xl font-bold text-blue-500">{{ stats.totalViews.toLocaleString() }}</p>
            <p class="text-sm text-gray-500">총 조회수</p>
          </div>
        </UCard>
      </div>

      <!-- 글 목록 -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">글 목록</h2>
            <UInput
              v-model="searchQuery"
              placeholder="검색..."
              icon="i-heroicons-magnifying-glass"
              size="sm"
              class="w-64"
            />
          </div>
        </template>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4">제목</th>
                <th class="text-left py-3 px-4">카테고리</th>
                <th class="text-left py-3 px-4">상태</th>
                <th class="text-left py-3 px-4">조회수</th>
                <th class="text-left py-3 px-4">작성일</th>
                <th class="text-left py-3 px-4">관리</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="post in filteredPosts"
                :key="post.id"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="py-3 px-4">
                  <NuxtLink :to="`/post/${post.slug}`" class="hover:text-primary">
                    {{ post.title }}
                  </NuxtLink>
                </td>
                <td class="py-3 px-4">
                  <UBadge :color="getCategoryColor(post.category.slug)" variant="subtle" size="sm">
                    {{ post.category.name }}
                  </UBadge>
                </td>
                <td class="py-3 px-4">
                  <UBadge :color="post.published ? 'success' : 'warning'" variant="subtle" size="sm">
                    {{ post.published ? '발행됨' : '임시저장' }}
                  </UBadge>
                </td>
                <td class="py-3 px-4 text-gray-500">
                  {{ post.viewCount.toLocaleString() }}
                </td>
                <td class="py-3 px-4 text-gray-500">
                  {{ formatDate(post.createdAt) }}
                </td>
                <td class="py-3 px-4">
                  <div class="flex gap-1">
                    <UButton
                      :to="`/admin/edit/${post.id}`"
                      color="neutral"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-pencil"
                    />
                    <UButton
                      color="error"
                      variant="ghost"
                      size="xs"
                      icon="i-heroicons-trash"
                      @click="confirmDelete(post)"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 글이 없을 때 -->
        <div v-if="filteredPosts.length === 0" class="text-center py-8 text-gray-500">
          글이 없습니다.
        </div>
      </UCard>
    </UContainer>

    <!-- 삭제 확인 모달 -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-semibold mb-4">글 삭제</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            "{{ postToDelete?.title }}" 글을 삭제하시겠습니까?
          </p>
          <div class="flex justify-end gap-2">
            <UButton color="neutral" variant="ghost" @click="deleteModalOpen = false">
              취소
            </UButton>
            <UButton color="error" :loading="deleting" @click="handleDelete">
              삭제
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { getCategoryColor } from '~/types/types'
import type { Post } from '~/types/types'

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient()
const router = useRouter()

// 데이터
const posts = ref<Post[]>([])
const searchQuery = ref('')
const deleteModalOpen = ref(false)
const postToDelete = ref<Post | null>(null)
const deleting = ref(false)

// 통계
const stats = computed(() => {
  const totalPosts = posts.value.length
  const publishedPosts = posts.value.filter(p => p.published).length
  const draftPosts = totalPosts - publishedPosts
  const totalViews = posts.value.reduce((sum, p) => sum + p.viewCount, 0)
  
  return { totalPosts, publishedPosts, draftPosts, totalViews }
})

// 필터링된 글 목록
const filteredPosts = computed(() => {
  if (!searchQuery.value) return posts.value
  
  const query = searchQuery.value.toLowerCase()
  return posts.value.filter(p => 
    p.title.toLowerCase().includes(query) ||
    p.category.name.toLowerCase().includes(query)
  )
})

// 데이터 로드
const loadPosts = async () => {
  const { posts: data } = await $fetch<{ posts: Post[] }>('/api/posts', {
    query: { published: 'all', limit: 100 }
  })
  posts.value = data
}

await loadPosts()

// 로그아웃
const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}

// 삭제 확인
const confirmDelete = (post: Post) => {
  postToDelete.value = post
  deleteModalOpen.value = true
}

// 삭제 실행
const handleDelete = async () => {
  if (!postToDelete.value) return
  
  deleting.value = true
  try {
    await $fetch(`/api/posts/${postToDelete.value.id}`, {
      method: 'DELETE'
    })
    
    posts.value = posts.value.filter(p => p.id !== postToDelete.value?.id)
    deleteModalOpen.value = false
  } catch (e) {
    console.error('Delete error:', e)
  } finally {
    deleting.value = false
  }
}

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>