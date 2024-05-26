<script setup lang="ts">
// const nuxtApp = useNuxtApp()
// const { loading, loadingPages } = storeToRefs(useLoading())
// const loadingSkeleton = ref(false)

// nuxtApp.hook('page:start', () => {
//   loading.value = true
//   loadingSkeleton.value = true
// })
// nuxtApp.hook('page:finish', () => {
//   setTimeout(() => {
//     loading.value = false
//     loadingSkeleton.value = false
//   }, 500)
// })
async function handleOut() {
  let { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else {
    const sbAccessToken = useCookie('sb-access-token')
    const token = useCookie('token')
    sbAccessToken.value = null
    token.value = null

    window.location.href = '/login'
  }
}
</script>

<template>
  <div class="min-h-screen">
    <div class="flex justify-end p-3 bg-white">
      <div>
        <UButton class="text-lg" @click="handleOut">Logout</UButton>
      </div>
    </div>
    <div class="overflow-auto">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
body {
  @apply bg-gray-50 dark:bg-gray-900;
}
</style>
