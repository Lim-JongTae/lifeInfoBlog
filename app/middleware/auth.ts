export default defineNuxtRouteMiddleware(async(to, from) => {
  const supabase = useSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return navigateTo('/admin/login')
  }

  // 관리자 권한 확인
  const isAdmin = await $fetch<boolean>('/api/auth/verify', {
    method: 'POST',
    body: { email: user.email }
  })

  if (!isAdmin) {
    await supabase.auth.signOut()
    return navigateTo('/admin/login')
  }
})
