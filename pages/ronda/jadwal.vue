<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">Jadwal Ronda</div>
    <div class="mb-5">
      <div class="grid grid-cols-12 grid-rows-1 gap-4">
        <div class="col-span-5">
          <UInput
            v-model="search"
            name="search"
            placeholder="Search..."
            icon="i-heroicons-magnifying-glass-20-solid"
            autocomplete="off"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing>
              <UButton
                v-show="search !== ''"
                color="gray"
                variant="link"
                icon="i-heroicons-x-mark-20-solid"
                :padded="false"
                @click="search = ''"
              />
            </template>
          </UInput>
        </div>
      </div>
    </div>

    <div class="overflow-auto">
      <MSATable
        :columns="columns"
        :rows="item"
        :ui="{
          base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
          divide: 'divide-y divide-[#ccc] dark:divide-gray-800',
        }"
      >
        <template #days-data="{ row }">
          <div>
            <UBadge
              v-if="row.day && row.day >= 0"
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
        <template #actions-data="{ row }">
          <div>
            <div
              v-if="row.day && row.day >= 0"
              class="flex justify-between w-40"
            >
              <UButton
                :variant="'solid'"
                color="blue"
                @click="handleUpdate(row)"
              >
                Update</UButton
              >
              <UButton
                :variant="'solid'"
                color="red"
                @click="handleDelete(row)"
              >
                Delete</UButton
              >
            </div>
            <div v-else>
              <UButton variant="solid" color="green" @click="handleAdd(row)"
                >Update
              </UButton>
            </div>
          </div>
        </template>
      </MSATable>
    </div>
    <UModal v-model="isOpen" prevent-close>
      <div class="p-4">
        <UForm :state="state" @submit="handleSubmit">
          <UFormGroup label="" name="day" autocomplete="false" required>
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
            <div class="text-center mt-3">
              <UButton color="link" @click="handleClose">Tutup</UButton>
            </div>
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface IJadwal {
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
  {
    key: 'actions',
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
    value: 0,
  },
]

const state = ref({
  id_complex: '',
  id_warga: '',
  day: new Date().getDay(),
})

const options = ref<{ name: string; value: string }[]>([])
const item = ref<IJadwal[]>([])
const user = useGetuser()
const search = ref('')

async function handleAdd(e: any) {
  state.value.id_warga = e.id
  state.value.id_complex = e.complex.id
  isOpen.value = true
}

function handleDays(e: number) {
  state.value.day = e
}

async function handleSubmit() {
  state.value.id_complex = (user.user && user.user.data[0]?.complex.id) || ''
  const { error } = await useFetch<{ data: IJadwal }>('/api/ronda', {
    method: 'POST',
    body: state.value,
    watch: false,
  })
  if (!error.value) {
    isOpen.value = false
    getData()
  }
}

interface IUpdate {
  id: string
  name: string
  complex: Complex
  day: number
  id_user: string
}

interface Complex {
  id: string
  house_complex: string
  link: string
}

async function handleUpdate(e: IUpdate) {
  state.value.id_warga = e.id
  state.value.day = e.day
  state.value.id_complex = e.complex.id
  isOpen.value = true
}

async function handleDelete(e: IUpdate) {
  const { error } = await useFetch<{ data: IUpdate }>('/api/delete-ronda', {
    method: 'DELETE',
    watch: false,
    query: {
      id: e.id_user,
    },
  })
  if (!error.value) {
    isOpen.value = false
    getData()
  }
}
function handleClose() {
  isOpen.value = false
  state.value = {
    id_complex: '',
    id_warga: '',
    day: new Date().getDay(),
  }
}

async function getData(e?: string) {
  const { data } = await useFetch<{ data: IJadwal[] }>('/api/get-ronda', {
    query: {
      v: user.user && user.user.data[0]?.complex.id,
      q: e ? e : '',
    },
  })
  if (data.value?.data) {
    item.value = data.value?.data
    options.value = data.value?.data
      .filter((item) => !item.day)
      .map((item: any) => {
        return {
          name: item.name,
          value: item.id,
        }
      })
  }
}
getData()

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
    case 0:
      return 'Minggu'
  }
}

watchDebounced(
  () => search.value,
  (newValue) => {
    getData(newValue)
  },
  { debounce: 500 }
)
</script>

<style lang="scss" scoped></style>
