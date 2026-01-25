
<script setup lang="ts">
import type { Post, PostsResponse } from '~/types/types';

const props = withDefaults(defineProps<PostsResponse>(), {
  limit: 0
})
const route = useRoute(); 
const { data } = await useAsyncData<any>(route.path, () => {
  return queryCollection('content')
    .limit(10)
    .all()
})
  const pages = computed(() => {
    if (!data.value) {
      return []
    }
    const result = []
    let lastYear: number | null = null
    for (const post of data.value ) {
      const year = new Date(post.createdAt).getFullYear()     
      const displayYear = year !== lastYear
      lastYear = year 
      
      result.push({
        ...post,
        displayYear,
        lastYear
      })          
    }
    return result
  })
</script>
  
<template>
  <slot :pages="pages">
    <section class="not-prose font-mono ml-3">
    <div class="column text-gray-400 text-sm">
      <div>date</div>
      <div>title</div>
    </div>
    <ul>
      <li v-for="page in pages" :key="page.path">
        <NuxtLink :to="page.path" class="column group hover:bg-gray-100 dark:hover:bg-gray-800">
          <div :class="{'text-white group-hover:text-gray-100 dark:text-gray-900 dark:group-hover:text-gray-800': !page.displayYear, 'text-gray-500 dark:text-gray-200': page.displayYear}">
            {{ page.lastYear }}
          </div>
          <div>{{ page.title }}</div>
        </NuxtLink>        
      </li> 
    </ul>
  </section>
  </slot>
</template>

