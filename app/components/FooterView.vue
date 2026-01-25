<template>
  <div>
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <UContainer>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex justify-between items-center space-x-2">
            <NuxtLink to="/">
              <NuxtImg src="/icon.png" width="30" height="30" />
            </NuxtLink>
            <p class="text-sm text-gray-500">
              © {{ new Date().getFullYear() }} 생활정보 블로그. All rights reserved.
            </p>
          </div>
          <div class="flex gap-4">
            <NuxtLink to="/about" class="text-sm text-gray-500 hover:text-primary">
              소개
            </NuxtLink>
            <NuxtLink to="/privacy" class="text-sm text-gray-500 hover:text-primary">
              개인정보처리방침
            </NuxtLink>
          </div>
        </div>
      </UContainer>
    </footer>

    <!-- 모바일 메뉴 Slideover -->
    <USlideover v-model:open="mobileMenuOpen">
      <template #content>
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <span class="font-bold text-lg">메뉴</span>
            <UButton
              icon="i-heroicons-x-mark"
              color="neutral"
              variant="ghost"
              @click="mobileMenuOpen = false"
            />
          </div>
          <nav class="flex flex-col gap-4">
            <NuxtLink 
              v-for="category in categories" 
              :key="category.slug"
              :to="`/category/${category.slug}`"
              class="text-gray-600 dark:text-gray-300 hover:text-primary py-2"
              @click="mobileMenuOpen = false"
            >
              {{ category.name }}
            </NuxtLink>
          </nav>
        </div>
      </template>
    </USlideover>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCategoryStore } from '~/stores/category'
const mobileMenuOpen = ref(false)
const categoryStore = useCategoryStore()
const { categories } = storeToRefs(categoryStore)

// 관리자 확인
const { isAdmin, checkAdmin } = useAdmin()

onMounted(() => {
  categoryStore.fetchCategories()
  checkAdmin()
})

</script>

<style>

</style>