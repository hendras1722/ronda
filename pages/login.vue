<template>
  <div class="h-screen flex justify-center items-center p-5">
    <div
      class="w-96 h-80 p-8 flex justify-center items-center rounded-tl-lg rounded-bl-lg border border-gray-200"
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
              />
            </UFormGroup>

            <UFormGroup label="Password" name="password" class="mt-3" required>
              <UInput
                icon="i-ion-locked"
                v-model="state.password"
                type="password"
                autocomplete="false"
                class="button_custom"
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
      class="w-96 h-80 p-8 flex justify-center items-center rounded-tr-md rounded-br-md bg-blue-600"
    >
      <div class="w-full">
        <div class="text-center text-2xl font-bold text-white">Sign Out</div>
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
  </div>
</template>

<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

definePageMeta({
  layout: false,
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

const sb_access = useCookie('sb_access')

async function submit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
  const { data } = await useFetch<{ data: any }>('/api/login', {
    method: 'POST',
    body: event.data,
  })
  if (data.value) {
    sb_access.value = data.value?.data.session.access_token
    window.location.href = '/'
  }
}
async function handleRegister() {
  const { data } = await useFetch('/api/invite-member')
  console.log(data)
}
</script>

<style lang="scss">
@import url('@/assets/scss/input_login.scss');
</style>
