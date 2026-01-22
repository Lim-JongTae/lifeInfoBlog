<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <UContainer>
        <nav class="flex items-center justify-between h-16">
          <!-- 로고 -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <NuxtImg src="/icon.png" width="30" height="35" class="" />
            <!-- <UIcon name="i-heroicons-document-text" class="w-6 h-6 text-primary" /> -->
            <span class="font-bold text-lg">생활정보</span>
          </NuxtLink>

          <!-- 카테고리 메뉴 -->
          <div class="hidden md:flex items-center gap-6">
            <NuxtLink 
              v-for="category in categories" 
              :key="category.slug"
              :to="`/category/${category.slug}`"
              class="text-sm text-gray-600 dark:text-gray-300 hover:text-primary transition-colors"
            >
              {{ category.name }}
            </NuxtLink>
          </div>

          <!-- 우측 메뉴 -->
          <div class="flex items-center gap-2">
            <UButton
              icon="i-heroicons-magnifying-glass"
              color="neutral"
              variant="ghost"
              to="/search"
            />
            <UColorModeButton />
            
            <!-- 모바일 메뉴 -->
            <UButton
              icon="i-heroicons-bars-3"
              color="neutral"
              variant="ghost"
              class="md:hidden"
              @click="mobileMenuOpen = true"
            />
          </div>
        </nav>
      </UContainer>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
      <UContainer>
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-500">
            © {{ new Date().getFullYear() }} 생활정보 블로그. All rights reserved.
          </p>
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

<script setup lang="ts">
const mobileMenuOpen = ref(false)

// 임시 카테고리 데이터 (나중에 Store에서 가져옴)
const categories = [
  { slug: 'finance', name: '금융위기탈출' },
  { slug: 'support', name: '정부지원금' },
  { slug: 'pension', name: '연금가이드' },
  { slug: 'insurance', name: '보험정보' },
  { slug: 'tips', name: '생활꿀팁' }
]
</script>