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
        <div class="col-span-3 col-start-10 flex justify-end">
          <UButton variant="solid" color="green" @click="handleAdd"
            >Tambah
          </UButton>
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
    <UModal v-model="isOpen">
      <div class="p-4">
        <UForm :state="state" @submit="handleSubmit">
          <UFormGroup
            label="Warga"
            name="id_warga"
            autocomplete="false"
            required
          >
            <USelect
              v-model="state.id_warga"
              :options="options"
              option-attribute="name"
            />
          </UFormGroup>

          <UFormGroup
            class="mt-3"
            label=""
            name="day"
            autocomplete="false"
            required
          >
            <div class="flex justify-between">
              <UButton
                :id="'days_' + item.value"
                v-for="(item, index) in daysItems"
                :key="index"
                :color="state.day === item.value ? 'green' : 'black'"
                @click="handleDays(item.value)"
                >{{ item.label }}</UButton
              >
            </div>
          </UFormGroup>
          <div class="mt-4">
            <UButton
              class="w-full ml-auto mr-auto block"
              type="submit"
              variant="soft"
              color="blue"
              size="lg"
            >
              Submit
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface IMember {
  created_at: Date
  id_complex: string
  phone: number | null
  id: string
  id_warga: string
  name: string
  blok: string
}

interface IJadwal {
  data: datas[]
}

interface datas {
  day: number
  name_warga: string
  house_complex: string
}
const isOpen = ref(false)
const columns = ref([
  {
    key: 'name',
    label: 'Nama Warga',
  },
  {
    key: 'days',
    label: 'Hari',
  },
])

const daysItems = [
  {
    label: 'Senin',
    value: 1,
  },
  {
    label: 'Selasa',
    value: 2,
  },
  {
    label: 'Rabu',
    value: 3,
  },
  {
    label: 'Kamis',
    value: 4,
  },
  {
    label: "Jum'at",
    value: 5,
  },
  {
    label: 'Sabtu',
    value: 6,
  },
  {
    label: 'Minggu',
    value: 7,
  },
]

const state = ref({
  id_complex: '',
  id_warga: '',
  day: 0,
})

const options = ref<{ name: string; value: string }[]>([])
const user = useGetuser()

function handleAdd() {
  isOpen.value = true
}

function handleDays(e: number) {
  state.value.day = e
}

async function handleSubmit() {
  // console.log('wewe')
  state.value.id_complex = (user.user && user.user.data[0]?.complex.id) || ''
  const { error } = await useFetch<{ data: IJadwal }>('/api/ronda', {
    method: 'POST',
    body: state.value,
  })
  if (!error.value) {
    isOpen.value = false
  }
}

const { data } = await useFetch<{ data: IJadwal }>('/api/get-ronda', {
  query: {
    q: user.user && user.user.data[0]?.complex.id,
  },
})
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

if (options.value.length < 1) {
  const { data: dataMember } = await useFetch<{ data: IMember[] }>(
    '/api/get-member',
    {
      method: 'GET',
      query: {
        v: user.user && user.user.data[0]?.complex.id,
      },
    }
  )
  if (data.value?.data) {
    const itemMember = dataMember.value?.data.map((item) => {
      return {
        name: item.name,
        value: item.id,
      }
    })
    options.value = itemMember || []
  }
}
</script>

<style lang="scss" scoped></style>
