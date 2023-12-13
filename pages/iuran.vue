<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">Iuran Warga</div>

    <div class="grid grid-cols-12 grid-rows-1 gap-4 mb-7">
      <div class="md:col-span-5 col-span-12">
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
      <div class="md:col-span-2 md:col-start-12 col-span-12 flex justify-end">
        <UButton
          variant="solid"
          color="green"
          @click="handleOpen"
          class="w-full ml-auto mr-auto block"
          >Tambah</UButton
        >
      </div>
      <div class="md:col-span-3 md:col-start-9 col-span-12 row-start-1">
        <USelect
          v-model="filterDana"
          name="filter"
          label="Filter"
          :options="[
            { name: 'All', value: 'all' },
            { name: 'Dana Masuk', value: 'true' },
            { name: 'Dana Keluar', value: 'false' },
          ]"
          option-attribute="name"
        />
      </div>
    </div>

    <div class="grid grid-cols-12 grid-rows-1 gap-4 mb-7">
      <div class="md:col-span-2 md:col-start-12 col-span-12 flex justify-end">
        <UButton
          variant="solid"
          color="blue"
          @click="handleDownload"
          class="md:w-fit w-full block"
          >Download</UButton
        >
      </div>
    </div>

    <div class="overflow-auto">
      <MSATable
        :columns="columns"
        :rows="itemIuran"
        :ui="{
          base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
          divide: 'divide-y divide-[#ccc] dark:divide-gray-800',
        }"
      >
        <template #created_at-data="{ row }">
          <div>{{ convertDate(row.created_at) }}</div>
        </template>
        <template #status-data="{ row }">
          <div v-if="row.status === 'true'">
            <UBadge color="green">Dana Masuk</UBadge>
          </div>
          <div v-else><UBadge color="red">Dana Keluar</UBadge></div>
        </template>
        <template #actions-data="{ index, row }">
          <UButton
            v-if="row.note"
            :variant="'soft'"
            color="blue"
            @click="handleExpanded(index)"
            >Lihat Catatan</UButton
          >
          <div v-else></div>
        </template>
        <template #expanded="{ rows }">
          <div class="p-3">
            Catatan:
            <q class="p-4">
              {{ rows.note }}
            </q>
          </div>
        </template>
      </MSATable>
    </div>
    <div class="flex justify-center mt-3">
      <UPagination
        :max="limit"
        :page-count="limit"
        :total="total"
        v-model="page"
      >
        <template #prev="{ onClick }">
          <UButton
            icon="i-heroicons-arrow-small-left-20-solid"
            color="primary"
            :ui="{ rounded: 'rounded-full' }"
            class="rtl:[&_span:first-child]:rotate-180"
            @click="onClick"
          />
        </template>

        <template #next="{ onClick }">
          <UButton
            icon="i-heroicons-arrow-small-right-20-solid"
            color="primary"
            :ui="{ rounded: 'rounded-full' }"
            class="rtl:[&_span:last-child]:rotate-180 ms-2"
            @click="onClick"
          /> </template
      ></UPagination>
    </div>

    <UModal v-model="isOpenModal">
      <div class="p-4">
        <UForm :state="state" @submit="submit">
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
            label="Uang sebesar"
            name="contribution"
            autocomplete="false"
            required
          >
            <UInput v-model="state.contribution" />
          </UFormGroup>
          <UFormGroup
            class="mt-3"
            label="Status"
            name="status"
            autocomplete="false"
            required
          >
            <USelect
              v-model="state.status"
              :options="[
                { name: 'Masuk', value: true },
                { name: 'Keluar', value: false },
              ]"
              option-attribute="name"
            />
          </UFormGroup>
          <UFormGroup
            class="mt-3"
            label="Catatan"
            name="note"
            autocomplete="false"
            required
          >
            <UInput v-model="state.note" />
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
import { format } from 'date-fns'
import * as XLSX from 'xlsx'

interface IMember {
  created_at: Date
  id_complex: string
  phone: number | null
  id: string
  id_warga: string
  name: string
  blok: string
}

interface IIuran {
  id: string
  created_at: string
  id_warga: string
  contribution: number
  id_complex: string
  name: string
  house_complex: string
  isExpanded?: boolean
  note: string
}

const isOpen = ref(false)
const isOpenModal = ref(false)
const columns = ref([
  {
    key: 'name',
    label: 'Nama Warga',
  },
  {
    key: 'contribution',
    label: 'Iuran',
  },
  {
    key: 'created_at',
    label: 'Tanggal',
  },
  {
    key: 'status',
    label: 'Status',
  },
  {
    key: 'actions',
  },
])
const options = ref<{ name: string; value: string }[]>([])
const state = ref({
  id_warga: '',
  contribution: 0,
  id_complex: '',
  status: '',
  note: '',
})
const user = useGetuser()
const search = ref('')
const itemIuran = ref<IIuran[]>()
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const filterDana = ref<any>('all')

function handleOpen() {
  state.value.id_warga = user.user.data[0].id
  isOpenModal.value = true
}

function handleExpanded(e: number) {
  if (itemIuran.value) {
    itemIuran.value[e].isExpanded = !itemIuran.value[e].isExpanded
  }
}

async function getData() {
  const { data: iuran } = await useFetch<{
    data: IIuran[]
    total: number
    page: number
  }>('/api/get-iuran', {
    query: {
      v: user.user && user.user.data[0].complex.id,
      q: search.value ? search.value : '',
      limit: limit.value,
      page: page.value || 1,
      filter: filterDana.value,
    },
  })

  itemIuran.value = iuran.value?.data.map((items) => {
    return {
      ...items,
      isExpanded: false,
    }
  })
  total.value = Number(iuran.value?.total) || 0
  page.value = Number(iuran.value?.page) || 0
}
getData()

watch(
  () => page.value,
  () => {
    getData()
  }
)
watch(
  () => filterDana.value,
  () => {
    getData()
  }
)

watchDebounced(
  () => search.value,
  () => {
    getData()
  },
  { debounce: 500 }
)

const { data } = await useFetch<{
  data: IMember[]
}>('/api/get-member', {
  method: 'GET',
  query: {
    v: user.user && user.user.data[0].complex.id,
    q: '',
  },
})
if (data.value?.data) {
  const item = data.value?.data.map((item) => {
    return {
      name: item.name,
      value: item.id,
    }
  })
  options.value = item
}

async function submit() {
  state.value.id_complex = user.user && user.user.data[0].complex.id
  state.value.contribution = Number(state.value.contribution)
  const { data } = await useFetch<{ data: any }>('/api/iuran', {
    method: 'POST',
    body: state.value,
    watch: false,
  })
  if (data.value) {
    await getData()
    isOpenModal.value = false
    // console.log(data.value)
  }
}

function convertDate(e: any) {
  if (!e) return
  return format(new Date(e), 'dd MMMM yyyy')
}

async function handleDownload() {
  const { data: iuran } = await useFetch<{ data: any }>('/api/download-iuran', {
    query: {
      v: user.user && user.user.data[0].complex.id,
      filter: filterDana.value,
    },
  })
  const data = XLSX.utils.json_to_sheet(iuran.value?.data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, data, 'data')
  XLSX.writeFile(
    wb,
    filterDana.value === 'true'
      ? 'Dana Masuk'
      : filterDana.value === 'false'
      ? 'Dana Keluar'
      : 'Semua'
  )
}
</script>

<style lang="scss" scoped></style>
