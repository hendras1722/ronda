<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">Iuran Warga</div>
    <div className="grid grid-cols-12 grid-rows-1 gap-4 mb-5">
      <div className="col-span-5">
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
      <div className="flex justify-end col-start-12">
        <UButton variant="solid" color="green" @click="isOpenModal = true"
          >Tambah</UButton
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
        <template #actions-data>
          <UButton :variant="'soft'" color="blue" @click="isOpen = true"
            >Detail</UButton
          >
        </template>
      </MSATable>
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

interface IMember {
  created_at: Date
  id_complex: string
  phone: number | null
  id: string
  id_warga: string
  name: string
  blok: string
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
    key: 'actions',
  },
])
const options = ref<{ name: string; value: string }[]>([])
const state = ref({
  id_warga: '',
  contribution: '',
})
const user = useGetuser()

const { data: iuran } = await useFetch<{ data: any[] }>('/api/get-iuran', {
  query: {
    v: user.user && user.user.data[0].complex.id,
  },
})
const itemIuran = computed(() => iuran.value?.data)

const { data } = await useFetch<{ data: IMember[] }>('/api/get-member', {
  method: 'GET',
  query: {
    v: user.user && user.user.data[0].complex.id,
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
  const { data } = await useFetch<{ data: any }>('/api/iuran', {
    method: 'POST',
    body: state.value,
  })
  if (data.value) {
    // console.log(data.value)
  }
}

function convertDate(e: any) {
  if (!e) return
  return format(new Date(e), 'dd MMMM yyyy')
}
</script>

<style lang="scss" scoped></style>
