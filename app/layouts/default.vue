<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <HeadView />    
    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
    <!-- Footer -->
   <FooterView />
  </div>
</template>

<script setup lang="ts">
</script>