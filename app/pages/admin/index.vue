
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
          <!--
          <div v-if="isAdmin">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="handleLogout"
            >
              로그아웃
            </UButton>
          </div>
          -->
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
                  <UBadge
                    :color="getCategoryColor(post.category.slug)"
                    variant="subtle"
                    size="sm"
                  >
                    {{ post.category.name }}
                  </UBadge>
                </td>
                <td class="py-3 px-4">
                  <UBadge
                    :color="post.published ? 'success' : 'warning'"
                    variant="subtle"
                    size="sm"
                  >
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

      <!-- ✅ Docs 목록 카드 (여기에 추가) -->
      <UCard class="mt-8">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="font-semibold">Docs 목록</h2>
            <UInput
              v-model="docsSearch"
              placeholder="문서 검색..."
              icon="i-heroicons-magnifying-glass"
              size="sm"
              class="w-64"
            />
          </div>
        </template>

        <!-- 로딩 상태가 필요하다면 docsPending 사용 -->
        <!-- <div v-if="docsPending" class="space-y-3 p-4">
          <USkeleton class="h-6 w-48" />
          <USkeleton class="h-6 w-full" />
          <USkeleton class="h-6 w-full" />
        </div> -->

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200 dark:border-gray-700">
                <th class="text-left py-3 px-4">제목</th>
                <th class="text-left py-3 px-4">경로</th>
                <th class="text-left py-3 px-4">작성일</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="doc in docsFiltered"
                :key="doc.path"
                class="border-b border-gray-100 dark:border-gray-800"
              >
                <td class="py-3 px-4">
                  <NuxtLink :to="doc.path" class="hover:text-primary">
                    {{ doc.title || doc.path }}
                  </NuxtLink>
                </td>
                <td class="py-3 px-4 text-gray-500">
                  {{ doc.path }}
                </td>
                <td class="py-3 px-4 text-gray-500">
                  {{ formatDocsDate(doc.date) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 문서가 없을 때 -->
        <div v-if="(docsItems?.length ?? 0) === 0" class="text-center py-8 text-gray-500">
          문서가 없습니다.
        </div>

        <!-- 페이지네이션 -->
        <div class="flex items-center justify-center gap-3 mt-6">
          <UButton
            :disabled="docsPage <= 1"
            color="neutral"
            variant="soft"
            @click="docsPage = Math.max(1, docsPage - 1)"
          >
            이전
          </UButton>

          <span class="text-sm text-gray-500">
            {{ docsPage }} / {{ docsTotalPages }}
          </span>

          <UButton
            :disabled="docsPage >= docsTotalPages"
            color="neutral"
            variant="soft"
            @click="docsPage = Math.min(docsTotalPages, docsPage + 1)"
          >
            다음
          </UButton>
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
  layout: 'admin',
  middleware: 'auth'
})
const { isAdmin, checkAdmin } = useAdmin()
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
  const authStore = useAuthStore()
  await authStore.logout()
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
//md파일 불러오기
const route = useRoute()
const page = computed(() => Number(route.query.page ?? 1))
const pageSize = 5
const offset = computed(() => (page.value - 1) * pageSize)

// frontmatter에 date/title/description이 있다면 select+order 활용
const { data: items, pending } = await useAsyncData(
  `docs-list-${page.value}`,
  () => queryCollection('content')
        .select('title', 'description', 'path', 'date')
        .order('date', 'DESC')          // 없으면 title 등 다른 키 사용
        .skip(offset.value)
        .limit(pageSize)
        .all()
)

const { data: total } = await useAsyncData(
  'docs-total',
  () => queryCollection('content').count()
)

const totalPages = computed(() => Math.max(1, Math.ceil((total.value ?? 0) / pageSize)))




// 페이지/검색 상태
const docsPage = ref(1)
const docsPageSize = 5
const docsSearch = ref('')
const docsOffset = computed(() => (docsPage.value - 1) * docsPageSize)

const formatDocsDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString() : '-'

// 목록(5개)
const { data: docsItems, pending: docsPending, refresh: refreshDocs } = await useAsyncData(
  () => `admin-docs-${docsPage.value}-${docsSearch.value}`,
  () => {
    // 기본 쿼리: 필요한 필드만 선택하고 최신순
    let q = queryCollection('content')
      .select('title', 'description', 'path', 'date')
      .order('date', 'DESC')      // frontmatter에 date 없으면 title 등으로 변경
      .skip(docsOffset.value)
      .limit(docsPageSize)

    // 서버 쿼리에서 LIKE 검색을 하려면 where/LIKE 로직을 작성할 수 있지만
    // 여기서는 간단히 클라이언트 필터(docsFiltered)로 처리합니다.
    return q.all()
  }
)

// 총 개수
const { data: docsTotal } = await useAsyncData(
  'admin-docs-total',
  () => queryCollection('content').count()
)

const docsTotalPages = computed(() =>
  Math.max(1, Math.ceil((docsTotal.value ?? 0) / docsPageSize))
)

// 클라이언트 필터(간단 검색)
const docsFiltered = computed(() => {
  const list = docsItems.value ?? []
  const s = docsSearch.value.trim().toLowerCase()
  if (!s) return list
  return list.filter(d =>
    (d.title ?? '').toLowerCase().includes(s) ||
    (d.description ?? '').toLowerCase().includes(s) ||
    (d.path ?? '').toLowerCase().includes(s)
  )
})

// 검색어 변경 시 첫 페이지로 이동 + 새로고침
watch(() => docsSearch.value, () => {
  docsPage.value = 1
  refreshDocs()
})

// 페이지 변경 시 새로고침
watch(() => docsPage.value, () => {
  refreshDocs()
})

// 날짜 포맷
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}
</script>