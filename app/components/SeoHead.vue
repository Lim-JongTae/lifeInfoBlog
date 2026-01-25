<script setup lang="ts">
  const props = defineProps<{
    title: string
    description: string
    image?: string
    type?: 'website' | 'article'
    publishedAt?: string
    modifiedAt?: string
  }>()
  
  const config = useRuntimeConfig()
  const route = useRoute()
  
  const fullUrl = computed(() => `${config.public.siteUrl}${route.fullPath}`)
  const ogImage = computed(() => props.image || `${config.public.siteUrl}/lifeinfo.png`)
  
  useHead({
    title: props.title,
    meta: [
      { name: 'description', content: props.description },
      // Open Graph
      { property: 'og:title', content: props.title },
      { property: 'og:description', content: props.description },
      { property: 'og:image', content: ogImage.value },
      { property: 'og:url', content: fullUrl.value },
      { property: 'og:type', content: props.type || 'website' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: props.title },
      { name: 'twitter:description', content: props.description },
      { name: 'twitter:image', content: ogImage.value },
      // Article
      ...(props.publishedAt ? [{ property: 'article:published_time', content: props.publishedAt }] : []),
      ...(props.modifiedAt ? [{ property: 'article:modified_time', content: props.modifiedAt }] : [])
    ],
    link: [
      { rel: 'canonical', href: fullUrl.value }
    ]
  })
  </script>
  
  <template>
    <div />
  </template>