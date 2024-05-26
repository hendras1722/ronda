<template>
  <div class="h-screen sm:flex sm:justify-center grid place-items-center p-5">
    <div
      class="sm:w-96 sm:rounded-tl-lg sm:rounded-bl-lg h-80 p-8 flex justify-center items-center border border-gray-200"
    >
      <div class="w-full">
        <div class="text-center text-2xl font-bold">Ronda Indonesia</div>
        <div>
          <div class="flex justify-center mt-5 w-full">
            <UButton variant="ghost" color="blue" @click="submit">
              <div class="google-btn">
                <div class="google-icon-wrapper">
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18px"
                    height="18px"
                    viewBox="0 0 48 48"
                    class="abcRioButtonSvg"
                  >
                    <g>
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      ></path>
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      ></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </g>
                  </svg>
                </div>
                <p class="btn-text"><b>Sign in with google</b></p>
              </div>
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
import { supabase } from '@/utils/supabase'

// import { supabase } from '@/utils/supabase';

definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      const user = useSupabaseUser()
      if (user.value) {
        // if (process.client) {
        return navigateTo('/admin/dashboard')
        // }
      }
    },
  ],
})
const user = useSupabaseUser()

watch(
  () => user.value,
  (newValue) => {
    if (newValue) {
      window.location.href = '/admin/dashboard'
    }
  },
  {
    deep: true,
  }
)

const schema = object({
  email: string(),
  password: string(),
})

type Schema = InferType<typeof schema>

const state = ref({
  email: '',
  password: '',
})

const stateRegister = ref({
  email: '',
  password: '',
})

const isOpen = ref(false)

const sbAccessToken = useCookie('sb-access-token')
// let { data, error } = await supabase.auth.auth.inviteUserByEmail('someone@email.com')

async function submit(event: FormSubmitEvent<Schema>) {
  // const getURL = () => {
  //   let url = 'http://localhost:3000/auth/callback'
  //   // Make sure to include `https://` when not localhost.
  //   url = url.includes('http') ? url : `https://ronda.vercel.app/auth/callback`
  //   // Make sure to include a trailing `/`.
  //   url = url.charAt(url.length - 1) === '/' ? url : `${url}`
  //   return url
  // }

  let { error, data } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  if (error) {
    console.log(error)
    // window.location.reload()
  }
  // Do something with event.data
  // const { data, error } = await useFetch<{ data: any }>('/api/login', {
  //   method: 'POST',
  //   body: event.data,
  //   watch: false,
  // })
  // if (!error.value) {
  //   console.log(data.value)
  //   // sb-access-token.value = data.value?.data.session.access_token
  //   // window.location.href = '/register-profile'
  // }
}

async function submitRegister(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  const { data, error } = await useFetch<{ data: any }>('/api/login', {
    method: 'POST',
    body: event.data,
    watch: false,
  })
  if (!error.value) {
    sbAccessToken.value = data.value?.data.session.access_token
    window.location.href = '/register-profile'
  }
}
async function handleRegister() {
  isOpen.value = true
  // const { data } = await useFetch('/api/invite-member')
  // console.log(data)
}
</script>

<style lang="scss">
@import url('@/assets/scss/input_login.scss');
</style>
