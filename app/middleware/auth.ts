export default defineNuxtRouteMiddleware(async(to, from) => {
  const authStore = useAuthStore()

  // 이미 확인했으면 캐시된 정보 사용
  if (authStore.isChecked) {
    if (!authStore.isAuthenticated) {
      return navigateTo('/admin/login')
    }
    return
  }

  // 처음 확인하는 경우만 Supabase에 요청
  const isAdmin = await authStore.checkAuth()

  if (!isAdmin) {
    return navigateTo('/admin/login')
  }
})
