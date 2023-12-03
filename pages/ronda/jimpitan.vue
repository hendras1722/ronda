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
      <template #status-data="{ row }">
        <div v-if="row?.jimpitan.length > 0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path
              fill="#61e563"
              d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58Z"
            />
          </svg>
        </div>
        <div v-else>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 512 512"
          >
            <path
              fill="#fafafa"
              d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58Z"
            />
          </svg>
        </div>
      </template>
    </MSATable>
  </div>
</template>

<script setup lang="ts">
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

const user = useGetuser()
const { data } = await useFetch<{ data: any[] }>('/api/get-jimpitan', {
  query: {
    q: user.user && user.user.data[0]?.complex.id,
  },
})
const item = computed(() => data.value?.data)
</script>

<style lang="scss" scoped></style>
