import { defineStore } from 'pinia'

interface AuthState {
  user: any | null
  isAdmin: boolean
  isChecked: boolean // 이미 확인했는지 여부
  loading: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAdmin: false,
    isChecked: false,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && state.isAdmin,
    isLoading: (state) => state.loading
  },

  actions: {
    // 사용자 정보 및 관리자 권한 확인 (최초 1회만)
    async checkAuth() {
      if (this.isChecked) {
        return this.isAuthenticated
      }

      this.loading = true

      try {
        const supabase = useSupabaseClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          this.clearAuth()
          return false
        }

        this.user = user

        // 관리자 권한 확인
        const isAdmin = await $fetch<boolean>('/api/auth/verify', {
          method: 'POST',
          body: { email: user.email }
        })

        this.isAdmin = isAdmin
        this.isChecked = true

        return isAdmin
      } catch (e) {
        console.error('Auth check error:', e)
        this.clearAuth()
        return false
      } finally {
        this.loading = false
      }
    },

    // 로그아웃
    async logout() {
      try {
        const supabase = useSupabaseClient()
        await supabase.auth.signOut()
      } catch (e) {
        console.error('Logout error:', e)
      } finally {
        this.clearAuth()
      }
    },

    // 인증 정보 초기화
    clearAuth() {
      this.user = null
      this.isAdmin = false
      this.isChecked = true // 확인했음 표시 (로그아웃은 확인된 상태)
      this.loading = false
    }
  }
})
