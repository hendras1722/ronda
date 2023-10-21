<script setup lang="ts">
const nuxtApp = useNuxtApp()
const store = useLoading(nuxtApp.$pinia)

store.pending()
nuxtApp.hook('page:start', () => {
  store.pending()
})

nuxtApp.hook('page:finish', () => {
  store.finish()
})
</script>

<template>
  <div>
    <NuxtLayout>
      <Loading />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
