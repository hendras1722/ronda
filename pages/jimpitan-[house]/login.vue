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
    function (from) {
      const user = useGetuser()
      const path = from.path.replace('jimpitan-', '')
      const regex = path.split(/[\/-]/gm).filter(Boolean)
      regex.splice(regex.length - 1, 1)
      const address = user.user.data.filter(
        (item) => item.complex.link === regex[0]
      )

      if (address.length > 0) {
        return navigateTo('/jimpitan-' + address[0].complex.link)
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

const sb_access = useCookie('sb_access')
// sb_access.value = null
// let { data, error } = await supabase.auth.auth.inviteUserByEmail('someone@email.com')

async function submit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  // console.log(event.data)
  const { data } = await useFetch<{ data: any }>('/api/login', {
    method: 'POST',
    body: event.data,
  })
  if (data.value) {
    sb_access.value = data.value?.data.session.access_token
    window.location.reload()
  }
}
async function handleRegister() {
  const { data } = await useFetch('/api/invite-member')
  // console.log(data)
}
</script>

<style lang="scss">
@import url('@/assets/scss/input_login.scss');
</style>
