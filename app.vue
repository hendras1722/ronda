<script setup lang="ts">
const nuxtApp = useNuxtApp()
const store = useLoading(nuxtApp.$pinia)
const { loadingPages } = store

store.pendingLoadingPages()
nuxtApp.hook('app:beforeMount', () => {
  store.pendingLoadingPages()
})
nuxtApp.hook('app:mounted', () => {
  store.finsihLoadingPages()
})
</script>

<template>
  <div>
    <Loading />
    <NuxtLayout>
      <div>
        <NuxtPage />
      </div>
    </NuxtLayout>
  </div>
</template>
