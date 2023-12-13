<script lang="ts" setup>
export type ErrorTypes = {
  url: string
  statusCode: number
  statusMessage: string
  message: string
  description: string
  data?: any
}
defineProps({
  error: {
    type: Object as PropType<ErrorTypes>,
    default: null,
  },
})
const route = useRoute()

const statusCodeForbidden = [403]

const currentRoute = route.path
async function logout() {
  let { error } = await supabase.auth.signOut()
  if (error) {
    console.log(error)
  } else {
    const sbAccessToken = useCookie('sb-access-token')
    const token = useCookie('token')
    sbAccessToken.value = null
    token.value = null
    if (currentRoute.includes('jimpitan')) {
      window.location.href = route.path + '/login'
    } else {
      window.location.href = '/login'
    }
  }
}

// const handleError = () => clearError({ redirect: '/' })
// const handleLogin = () => logout()
</script>
<template>
  <div class="min-h-screen flex justify-center items-center">
    <div v-if="statusCodeForbidden.includes(error.statusCode)">
      <img src="/undraw_questions_re_1fy7.svg" />
      <div class="text-center mt-5 text-2xl">
        Kamu siapa ? kamu gak dibolehin masuk
      </div>
      <UButton
        class="w-full ml-auto mr-auto block mt-5"
        variant="solid"
        color="red"
        size="lg"
        @click="logout"
      >
        Keluar
      </UButton>
    </div>
    <div v-if="error.statusCode >= 500">
      <img src="/undraw_dev_focus_re_6iwt.svg" />
      <div class="text-center mt-5 text-2xl">
        Lagi sibuk nih entar aja yakkkk
      </div>
      <UButton
        class="w-full ml-auto mr-auto block mt-5"
        variant="solid"
        color="red"
        size="lg"
        @click="logout"
      >
        Keluar
      </UButton>
    </div>
  </div>
</template>
