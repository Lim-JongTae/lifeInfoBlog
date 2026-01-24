<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- 관리자 헤더 -->
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <!-- 로고 -->
          <NuxtLink to="/admin" class="flex items-center gap-2">
            <UIcon name="i-heroicons-cog-6-tooth" class="w-6 h-6 text-primary" />
            <span class="font-bold text-lg">관리자모드</span>
          </NuxtLink>

          <!-- 네비게이션 -->
          <nav class="flex items-center gap-1">
            <!-- <UButton
              to="/admin"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-home"
            >
              대시보드
            </UButton> -->
            <UButton
              to="/admin/write"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-pencil-square"
            >
              글 작성
            </UButton>
            <UButton
              to="/"
              color="neutral"
              variant="ghost"
              icon="i-heroicons-globe-alt"
              target="_blank"
            >
              사이트 보기
            </UButton>
          </nav>

          <!-- 우측 메뉴 -->
          <div class="flex items-center gap-2">
            <UColorModeButton />
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
      </UContainer>
    </header>

    <!-- 본문 -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const router = useRouter()

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>