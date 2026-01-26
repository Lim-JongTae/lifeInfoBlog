<template>
  <UContainer class="flex items-center justify-center sm:p-4 sm:min-w-160 mt-56 dark:bg-gray-500 bg-gray-100">
    <UCard class="w-full max-w-md">
      <template #header>
        <div class="text-center p-4">
          <h1 class="text-sm sm:text-xl font-semibold">
            관리자 모드에 오신것을 환경합니다.
          </h1>
        </div>
    </template>
    
      <UForm :schema="schema" :state="state" class="space-y-4" @submit.prevent="handleLogin" >       
        <UFormField label="이메일" name="email" required>
          <UInput v-model="state.email" placeholder="이메일" class="w-full"/>
       </UFormField>
        <UFormField label="비밀번호" name="password" required>
          <UInput v-model="state.password" placeholder="비밀번호" type="password" class="w-full"/>
       </UFormField>        
       <UButton type="submit" color="neutral" block>
        로그 인
       </UButton>
      </UForm>
      <!-- <div class="text-center text-sm">
        회원가입 하기!
        <UButton 
          variant="link"
          color="primary"
          :disabled="false"
          to="/auth/register"
          class="-ml-2"
        >
        회원가입
        </UButton>
      </div>  -->
    
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import * as z from 'zod'
definePageMeta({
  layout: false
})
const supabase = useSupabaseClient()
const router = useRouter()

// const email = ref('')
// const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: state.email ?? '',
      password: state.password ?? ''
    })

    if (authError) throw authError

    // auth store에서 관리자 권한 확인 및 캐시
    const authStore = useAuthStore()
    authStore.isChecked = false // 강제로 다시 확인
    const isAdmin = await authStore.checkAuth()

    if (!isAdmin) {
      await supabase.auth.signOut()
      throw new Error('관리자 권한이 없습니다.')
    }

    router.push('/admin/login')
  } catch (e: any) {
    error.value = e.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
const schema = z.object({  
  email: z.email('이메일을 확인하세요!'),
  password: z.string('Password is required').min(8, '비밀번호는 8자 이상이어야 됩니다.') 
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: "" as string,
  password: "" as string
})
</script>
<style scoped>

</style>