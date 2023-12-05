<template>
  <div class="h-screen sm:flex sm:justify-center grid place-items-center p-5">
    <div
      class="sm:w-96 sm:rounded-tl-lg sm:rounded-bl-lg h-80 p-8 flex justify-center items-center border border-gray-200"
    >
      <div class="w-full">
        <div class="text-center text-2xl font-bold">Sign In</div>
        <div>
          <UForm :schema="schema" :state="state" @submit="submit">
            <UFormGroup
              label="Email"
              name="email"
              autocomplete="false"
              required
            >
              <UInput
                icon="i-ion-person-sharp"
                v-model="state.email"
                autocomplete="false"
                class="button_custom"
                placeholder="Enter your email"
              />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="mt-3" required>
              <UInput
                icon="i-ion-locked"
                v-model="state.password"
                type="password"
                autocomplete="false"
                class="button_custom"
                placeholder="Enter your password"
              />
            </UFormGroup>

            <div class="flex justify-center mt-5 w-full">
              <UButton
                class="w-full ml-auto mr-auto block"
                type="submit"
                variant="solid"
                color="blue"
                size="lg"
              >
                Submit
              </UButton>
            </div>
          </UForm>
        </div>
      </div>
    </div>
    <div
      class="sm:w-96 sm:rounded-tr-md sm:rounded-br-md h-80 p-8 flex justify-center items-center bg-blue-600"
    >
      <div class="w-full">
        <div class="text-center text-2xl font-bold text-white">Register</div>
        <div class="mt-5 text-white">
          Create an account to start ordering today!
        </div>
        <div class="text-center mt-5">
          <UButton variant="outline" color="white" @click="handleRegister"
            >Register</UButton
          >
        </div>
      </div>
    </div>
    <UModal v-model="isOpen">
      <div class="p-5">
        <div class="text-center text-4xl font-extrabold mb-5">Register</div>
        <UForm :schema="schema" :state="stateRegister" @submit="submitRegister">
          <UFormGroup label="Email" name="email" autocomplete="false" required>
            <UInput
              icon="i-ion-person-sharp"
              v-model="state.email"
              autocomplete="false"
              class="button_custom"
              placeholder="Enter your email"
            />
          </UFormGroup>

          <UFormGroup label="Password" name="password" class="mt-3" required>
            <UInput
              icon="i-ion-locked"
              v-model="state.password"
              type="password"
              autocomplete="false"
              class="button_custom"
              placeholder="Enter your password"
            />
          </UFormGroup>

          <div class="flex justify-center mt-5 w-full">
            <UButton
              class="w-full ml-auto mr-auto block"
              type="submit"
              variant="solid"
              color="blue"
              size="lg"
            >
              Register
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'
// import { supabase } from '@/utils/supabase';

definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      const token = useCookie('sb_access_admin')
      const jwt = token.value
      if (!jwt) return
      const data = parseJwt(jwt)
      if (Date.now() <= data.exp * 1000 && jwt && from.path === '/login') {
        return navigateTo('/')
      }
    },
  ],
})

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

const sb_access = useCookie('sb_access_admin')
const sb_access_user = useCookie('sb_access')
sb_access_user.value = null
// let { data, error } = await supabase.auth.auth.inviteUserByEmail('someone@email.com')

async function submit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  const { data, error } = await useFetch<{ data: any }>('/api/login', {
    method: 'POST',
    body: event.data,
  })
  if (!error.value) {
    sb_access.value = data.value?.data.session.access_token
    window.location.href = '/register-profile'
  }
}

async function submitRegister(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  const { data, error } = await useFetch<{ data: any }>('/api/login', {
    method: 'POST',
    body: event.data,
  })
  if (!error.value) {
    sb_access.value = data.value?.data.session.access_token
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
