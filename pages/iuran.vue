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
      :rows="itemIuran"
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
    key: 'id',
    label: 'No',
  },
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
    v: user.user && user.user[0].complex.id,
  },
})
const itemIuran = computed(() => iuran.value?.data)

const { data } = await useFetch<{ data: IMember[] }>('/api/get-member', {
  method: 'GET',
  query: {
    v: user.user && user.user[0].complex.id,
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
    console.log(data.value)
  }
}
</script>

<style lang="scss" scoped></style>
