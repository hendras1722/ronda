<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">Jadwal Ronda</div>
    <div class="mb-5">
      <div class="grid grid-cols-12 grid-rows-1 gap-4">
        <div class="col-span-5">
          <UInput
            placeholder="Search..."
            icon="i-heroicons-magnifying-glass-20-solid"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
              />
            </template>
          </UInput>
        </div>
      </div>
    </div>

    <MSATable
      :columns="columns"
      :rows="item"
      :ui="{
        base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
        divide: 'divide-y divide-[#ccc] dark:divide-white',
      }"
    >
      <template #status-data>
        <div>Hello</div>
      </template>
    </MSATable>
    <USlideover v-model="isOpen">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Slideover
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
      </UCard>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const item = ref([
  {
    id: 1,
    blok: 'Blok A',
  },
])
const columns = ref([
  {
    key: 'blok',
    label: 'Rumah Blok',
  },
  {
    key: 'status',
    label: 'Status',
  },
])
</script>

<style lang="scss" scoped></style>
