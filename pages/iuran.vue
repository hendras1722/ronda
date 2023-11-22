<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">Iuran Warga</div>
    <div class="flex justify-end py-4">
      <UButton variant="solid" color="green" @click="isOpenModal = true"
        >Tambah</UButton
      >
    </div>
    <MSATable
      :columns="columns"
      :rows="item"
      :ui="{
        base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
        divide: 'divide-y divide-[#ccc] dark:divide-gray-800',
      }"
    >
      <template #actions-data>
        <UButton :variant="'soft'" color="blue" @click="isOpen = true"
          >Detail</UButton
        >
      </template>
    </MSATable>

    <UModal v-model="isOpenModal">
      <div class="p-4">
        <div></div>
        <UInput />
      </div>
    </UModal>

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
const isOpenModal = ref(false)
const item = ref([])
const columns = ref([
  {
    key: 'id',
    label: 'No',
  },
  {
    key: 'member',
    label: 'Nama Warga',
  },
  {
    key: 'iuran',
    label: 'Iuran',
  },
  {
    key: 'updated_at',
    label: 'Tanggal',
  },
  {
    key: 'actions',
  },
])
const token = useCookie('token')
console.log(token.value)
</script>

<style lang="scss" scoped></style>
