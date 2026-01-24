<template>
  <div class="adsense-container">
    <!-- 개발 환경: 플레이스홀더 -->
    <div 
      v-if="isDev" 
      class="bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 text-sm"
      :class="sizeClass"
    >
      광고 영역 ({{ type }})
    </div>
    
    <!-- 프로덕션: 실제 AdSense -->
    <ins
      v-else
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="format"
      data-full-width-responsive="true"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type?: 'banner' | 'sidebar' | 'in-article' | 'rectangle'
  slot: string
}>()

const config = useRuntimeConfig()
const isDev = process.dev

const adClient = config.public.adsenseClient || ''
const adSlot = props.slot

// 광고 타입별 스타일
const sizeClass = computed(() => {
  switch (props.type) {
    case 'banner':
      return 'h-24 w-full'
    case 'sidebar':
      return 'h-64 w-full'
    case 'in-article':
      return 'h-32 w-full my-4'
    case 'rectangle':
      return 'h-64 w-full'
    default:
      return 'h-24 w-full'
  }
})

const adStyle = computed(() => {
  switch (props.type) {
    case 'banner':
      return 'display:block; height:96px;'
    case 'sidebar':
      return 'display:block; height:256px;'
    case 'in-article':
      return 'display:block; text-align:center;'
    case 'rectangle':
      return 'display:inline-block; width:300px; height:250px;'
    default:
      return 'display:block;'
  }
})

const format = computed(() => {
  return props.type === 'in-article' ? 'fluid' : 'auto'
})

// 프로덕션에서 AdSense 스크립트 로드
onMounted(() => {
  if (!isDev && adClient) {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.error('AdSense error:', e)
    }
  }
})
</script>