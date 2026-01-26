
<!-- pages/docs/index.vue -->
<script setup lang="ts">
const route = useRoute()
const page = Number(route.query.page ?? 1)
const pageSize = 5
const offset = (page - 1) * pageSize

const { data: items, pending } = await useAsyncData(
  `docs-list-${page}`,
  () => queryCollection('docs')
        .select('title', 'description', 'path', 'date') // frontmatter schema 선언 시(선택)
        .order('date', 'DESC')   // 없으면 title 등 다른 키로
        .skip(offset)
        .limit(pageSize)
        .all()
)

const { data: total } = await useAsyncData(
  `docs-total`,
  () => queryCollection('docs').count()
)

const totalPages = computed(() => Math.max(1, Math.ceil((total.value ?? 0) / pageSize)))
</script>

<template>
  <UContainer class="py-10">
    <h1 class="text-2xl font-bold mb-6">문서</h1>

    <!-- 로딩 -->
    <div v-if="pending" class="space-y-3">
      <USkeleton class="h-6 w-48" />
      <USkeleton class="h-28 w-full" />
      <USkeleton class="h-28 w-full" />
      <USkeleton class="h-28 w-full" />
    </div>

    <!-- 목록 -->
    <div v-else>
      <ul class="space-y-4">
        <li v-for="item in items || []" :key="item.path" class="border rounded p-4 hover:bg-gray-50 dark:hover:bg-gray-900/30">
          <NuxtLink :to="item.path" class="block">
            <h2 class="text-lg font-semibold">
              {{ item.title || item.path }}
            </h2>
            <p v-if="item.description" class="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {{ item.description }}
            </p>
          </NuxtLink>
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <nav class="flex items-center justify-center gap-3 mt-8">
        <UButton
          :to="{ query: { page: Math.max(1, page - 1) } }"
          :disabled="page <= 1"
          color="neutral"
          variant="soft"
        >
          이전
        </UButton>

        <span class="text-sm text-gray-500">
          {{ page }} / {{ totalPages }}
        </span>

        <UButton
          :to="{ query: { page: Math.min(totalPages, page + 1) } }"
          :disabled="page >= totalPages"
          color="neutral"
          variant="soft"
        >
          다음
        </UButton>
      </nav>
    </div>
  </UContainer>
</template>

