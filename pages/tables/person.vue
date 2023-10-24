<script setup lang="ts">
const isDark = useColorMode()
const date = ref(new Date())
const isOpen = ref(false)

const params = ref({
  q: '',
  limit: 10,
  skipped: 0,
  page: 1,
})
const itemsUsers = ref([])
const limit = ref(10)
const totalPagination = ref<number>(0)
const masks = ref({
  input: 'YYYY-MM-DD hh:mm',
})
let url = `https://dummyjson.com/users/search`

const columns = [
  {
    key: 'username',
    label: 'Username',
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

async function getItemsData() {
  const { data, status } = await useFetch<{ users: any; total: number }>(url, {
    params: {
      ...params.value,
    },
  })
  itemsUsers.value = data.value?.users
  totalPagination.value = data.value?.total || 0
}
await getItemsData()

function handleModal() {
  isOpen.value = true
}

watch(
  () => params.value.q,
  () => {
    url = `https://dummyjson.com/users/search`
    getItemsData()
  }
)

watch(
  () => params.value.page,
  (newValue) => {
    url = `https://dummyjson.com/users`
    params.value.skipped = limit.value * newValue - limit.value
    getItemsData()
  }
)
</script>

<template>
  <div>
    <div class="text-2xl font-bold">Person</div>
    <div class="grid grid-cols-12 grid-rows-1 gap-4 mt-3">
      <div class="md:col-span-10 col-span-12">
        <UInput
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
            <UInput
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
        :columns="columns"
        :rows="itemsUsers"
        class="border border-gray-300 rounded-2xl overflow-auto table-fixed"
      >
        <template #actions-data="{ index }">
          <UButton variant="outline" color="blue" @click="handleModal"
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
          <!-- :value="1" -->
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
          Euy
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<style scoped></style>
