<script setup lang="ts">
const nuxtApp = useNuxtApp()
const store = useLoading(nuxtApp.$pinia)

store.pendingLoadingPages()
nuxtApp.hook('app:created', () => {
  store.pendingLoadingPages()
})
nuxtApp.hook('page:finish', () => {
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

<style lang="scss" setup>
body {
  @apply overflow-hidden;
}
</style>
