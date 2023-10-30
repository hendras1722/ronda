<script setup lang="ts">
import { object, string } from 'yup'
import type { InferType } from 'yup'
import type { FormSubmitEvent } from '@nuxt/ui-edge/dist/runtime/types'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required'),
})

const state = ref({
  firstName: '',
  lastName: '',
  age: 0,
})

const isDark = useColorMode()
const date = ref(new Date())
const isOpen = ref(false)

const { loadingPages } = storeToRefs(useLoading())

const params = ref({
  q: '',
  limit: 10,
  skip: 0,
  page: 1,
})
const itemsUsers = ref([])
const limit = ref(5)
const totalPagination = ref<number>(0)
const masks = ref({
  input: 'YYYY-MM-DD hh:mm',
})
let url = `/api/users/search`

const columns = [
  {
    key: 'username',
    label: 'Username',
  },
  {
    key: 'firstName',
    label: 'First Name',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'university',
    label: 'University',
  },
  {
    key: 'gender',
    label: 'Gender',
  },
  {
    key: 'actions',
  },
]

const { loading } = storeToRefs(useLoading())

async function getItemsData() {
  loading.value = true
  const { data, status, pending } = await useFetch<{
    users: any
    total: number
  }>(url, {
    params: {
      ...params.value,
    },
    lazy: false,
  })
  loading.value = pending.value
  itemsUsers.value = data.value?.users
  totalPagination.value = data.value?.total || 0
}
await getItemsData()

function handleModal() {
  isOpen.value = true
}

watchDebounced(
  () => params.value.q,
  () => {
    getItemsData()
  },
  { debounce: 550 }
)

watch(
  () => params.value.page,
  (newValue) => {
    params.value.skip = limit.value * newValue - limit.value
    getItemsData()
  }
)
</script>

<template>
  <div>
    <div class="text-2xl font-extrabold">Person</div>

    <div class="grid grid-cols-12 grid-rows-1 gap-4 mt-3">
      <div class="md:col-span-10 col-span-12">
        <Input
          v-model="params.q"
          icon="i-heroicons-magnifying-glass-20-solid"
          color="white"
          variant="outline"
          name="input"
          placeholder="Search..."
        />
      </div>
      <VDatePicker
        v-model="date"
        :masks="masks"
        :is-dark="isDark"
        :popover="{ placement: 'bottom' }"
        :min-date="new Date()"
      >
        <template v-slot="{ inputValue, inputEvents }">
          <div class="md:col-span-2 md:col-start-11 col-span-12">
            <Input
              icon="i-ion-md-calendar"
              :value="inputValue"
              v-on="inputEvents"
            />
          </div>
        </template>
      </VDatePicker>
    </div>

    <div class="mt-3">
      <UTable
        :loading="loading"
        :loading-state="{
          icon: 'i-heroicons-arrow-path-20-solid',
          label: 'Loading...',
        }"
        :columns="columns"
        :rows="itemsUsers"
        class="border border-gray-300 rounded-2xl overflow-auto table-fixed"
      >
        <template #loading> woiii loading... </template>
        <template #gender-data="{ row }">
          <UBadge
            class="!text-gray-200 capitalize"
            variant="solid"
            :color="row.gender.includes('female') ? 'blue' : 'red'"
            >{{ row.gender }}</UBadge
          >
        </template>
        <template #actions-data="{ index }">
          <UButton
            :icon="'i-ion-add-circle-outline'"
            variant="outline"
            color="blue"
            @click="handleModal"
            >ADD</UButton
          >
        </template>
      </UTable>
      <div class="mt-3 flex justify-center">
        <UPagination
          v-model="params.page"
          :active-button="{ variant: 'outline' }"
          :inactive-button="{ color: 'gray' }"
          :total="totalPagination"
          :ui="{ rounded: 'rounded-lg' }"
        >
          <template #prev="{ onClick }">
            <UTooltip text="Previous page">
              <UButton
                icon="i-heroicons-arrow-small-left-20-solid"
                color="primary"
                :ui="{ rounded: 'rounded-full' }"
                class="rtl:[&_span:first-child]:rotate-180 me-2 dark:bg-gray-800 dark:text-white"
                @click="onClick"
              />
            </UTooltip>
          </template>

          <template #next="{ onClick }">
            <UTooltip text="Next page">
              <UButton
                icon="i-heroicons-arrow-small-right-20-solid"
                color="primary"
                :ui="{ rounded: 'rounded-full' }"
                class="rtl:[&_span:last-child]:rotate-180 ms-2 dark:bg-gray-800 dark:text-white"
                @click="onClick"
              />
            </UTooltip>
          </template>
        </UPagination>
      </div>
      <UModal v-model="isOpen">
        <UCard
          :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
          <!-- Content -->
          <UForm :schema="schema" :state="state">
            <UFormGroup
              label="First Name"
              name="firstName"
              autocomplete="false"
              required
            >
              <Input
                parsing="text"
                v-model="state.firstName"
                autocomplete="false"
              />
            </UFormGroup>

            <UFormGroup label="Last Name" name="lastName" class="mt-3" required>
              <Input v-model="state.lastName" autocomplete="false" />
            </UFormGroup>

            <UFormGroup label="age" name="lastName" class="mt-3" required>
              <Input parsing="text" v-model="state.age" autocomplete="false" />
            </UFormGroup>

            <div class="flex justify-center mt-5 w-full">
              <UButton
                class="w-full ml-auto mr-auto block"
                type="submit"
                variant="solid"
                color="blue"
              >
                Submit
              </UButton>
            </div>
          </UForm>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<style scoped></style>
