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
        divide: 'divide-y divide-[#ccc] dark:divide-gray-800',
      }"
    >
      <template #days-data="{ row, index }">
        <div>
          <UBadge
            :color="
              row.day === 1
                ? 'green'
                : row.day === 2
                ? 'yellow'
                : row.day === 3
                ? 'pink'
                : row.day === 4
                ? 'blue'
                : row.day === 5
                ? 'cyan'
                : row.day === 6
                ? 'purple'
                : 'red'
            "
            variant="solid"
            >{{ useDays(row.day) }}</UBadge
          >
        </div>
      </template>
    </MSATable>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const columns = ref([
  {
    key: 'name_warga',
    label: 'Nama Warga',
  },
  {
    key: 'days',
    label: 'Hari',
  },
  // {
  //   key: 'actions',
  // },
])

interface IJadwal {
  data: datas[]
}

interface datas {
  day: number
  name_warga: string
  house_complex: string
}

const { data } = await useFetch<{ data: IJadwal }>('/api/patroli')
const item = computed(() => data.value?.data)

function useDays(e: number) {
  switch (e) {
    case 1:
      return 'Senin'
    case 2:
      return 'Selasa'
    case 3:
      return 'Rabu'
    case 4:
      return 'Kamis'
    case 5:
      return 'Jumat'
    case 6:
      return 'Sabtu'
    case 7:
      return 'Minggu'
  }
}
</script>

<style lang="scss" scoped></style>
