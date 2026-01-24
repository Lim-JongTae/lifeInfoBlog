export const useAdmin = () => {
  const supabase = useSupabaseClient()
  const isAdmin = ref(false)
  const loading = ref(true)

  const checkAdmin = async () => {
    loading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        isAdmin.value = false
        return
      }

      const result = await $fetch<boolean>('/api/auth/verify', {
        method: 'POST',
        body: { email: user.email }
      })

      isAdmin.value = result
    } catch (e) {
      isAdmin.value = false
    } finally {
      loading.value = false
    }
  }

  return {
    isAdmin,
    loading,
    checkAdmin
  }
}