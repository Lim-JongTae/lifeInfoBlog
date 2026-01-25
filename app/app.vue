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
<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>