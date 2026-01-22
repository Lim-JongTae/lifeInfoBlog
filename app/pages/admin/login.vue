<template>
  <div class="min-h-screen flex items-center justify-center">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">관리자 로그인</h1>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormField label="이메일">
          <UInput
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            icon="i-heroicons-envelope"
            required
          />
        </UFormField>

        <UFormField label="비밀번호">
          <UInput
            v-model="password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            required
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
          block
          :loading="loading"
        >
          로그인
        </UButton>

        <p v-if="error" class="text-sm text-red-500 text-center">
          {{ error }}
        </p>
      </form>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (authError) throw authError

    // 관리자 권한 확인
    const isAdmin  = await $fetch<boolean>('/api/auth/verify', {
      method: 'POST',
      body: { email: email.value }
    })

    if (!isAdmin) {
      await supabase.auth.signOut()
      throw new Error('관리자 권한이 없습니다.')
    }

    router.push('/admin')
  } catch (e: any) {
    error.value = e.message || '로그인에 실패했습니다.'
  } finally {
    loading.value = false
  }
}
</script>