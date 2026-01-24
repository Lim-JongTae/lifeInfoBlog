<script setup lang="ts">
const config = useRuntimeConfig()

// AdSense 스크립트 로드 (프로덕션만)
const isDev = import.meta.dev

if (!isDev && config.public.adsenseClient) {
  useHead({
    script: [
      {
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.public.adsenseClient}`,
        async: true,
        crossorigin: 'anonymous'
      }
    ]
  })
}
</script>>
<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout >
      <NuxtPage />
    </NuxtLayout>
  </UApp>  
</template>
