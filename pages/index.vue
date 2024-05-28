<template>
  <div class="min-h-screen flex justify-center items-center">
    <div class="border border-gray-400 p-10 rounded-lg">
      <div class="mb-3 font-extrabold">Pilih Mau Masuk Kemana</div>
      <div class="my-3">
        <UButton
          @click="pushLink('dashboard')"
          variant="solid"
          size="lg"
          class="w-full justify-center"
          >Dashboard</UButton
        >
      </div>
      <div>
        <UButton
          @click="pushLink('landing')"
          variant="solid"
          size="lg"
          class="w-full justify-center"
          >Ambil Jimpitan</UButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

definePageMeta({
  layout: false,
  middleware: [
    function (from, to) {
      const user = useGetuser()
      if (user.user.data.length < 1 && from.path === '/login') {
        return to.path === 'register-profile'
      }
    },
  ],
})
function pushLink(e: string) {
  const user = useGetuser()
  if (e === 'dashboard') {
    router.push('/admin/dashboard')
    return
  }
  router.push('jimpitan-' + user.user.data[0].complex?.link)
}
</script>
