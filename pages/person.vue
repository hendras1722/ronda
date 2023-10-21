<template>
  <div>
    <div>Person</div>
    <div class="grid grid-cols-12 grid-rows-1 gap-4 mt-3">
      <div class="md:col-span-10 col-span-12">
        <UInput
          icon="i-heroicons-magnifying-glass-20-solid"
          color="white"
          variant="outline"
          name="input"
          placeholder="Search..."
        />
      </div>
      <VDatePicker v-model="date" :masks="masks">
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
        class="border border-gray-300 rounded-2xl overflow-auto"
      />
      <div class="mt-3 flex justify-center">
        <UPagination
          v-model="page"
          :active-button="{ variant: 'outline' }"
          :inactive-button="{ color: 'gray' }"
          :value="1"
          :total="100"
          :ui="{ rounded: 'rounded-lg' }"
        >
          <template #prev="{ onClick }">
            <UTooltip text="Previous page">
              <UButton
                icon="i-heroicons-arrow-small-left-20-solid"
                color="primary"
                :ui="{ rounded: 'rounded-full' }"
                class="rtl:[&_span:first-child]:rotate-180 me-2"
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
                class="rtl:[&_span:last-child]:rotate-180 ms-2"
                @click="onClick"
              />
            </UTooltip>
          </template>
        </UPagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const date = ref(new Date())

const page = ref(1)
const masks = ref({
  input: 'YYYY-MM-DD hh:mm',
})

const users = await useFetch<{ users: any }>(
  'https://dummyjson.com/users?limit=5'
)
const itemsUsers = computed(() => users.data.value?.users)
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
]
</script>

<style scoped></style>
