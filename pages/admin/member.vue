<template>
  <div>
    <div class="text-2xl font-extrabold mb-5">
      <!-- Warga: {{ (item || [])[0]?.house }} -->
    </div>
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
        :loading="pending"
        :columns="columns"
        :rows="item"
        :ui="{
          base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
          divide: 'divide-y divide-[#ccc] dark:divide-gray-800',
        }"
      >
        <template #name-data="{ row }">
          <div>{{ row.name }}</div>
        </template>

        <template #blok-data="{ row }">
          <div>{{ row.blok }}</div>
        </template>

        <template #phone-data="{ row }">
          <div>{{ row.phone }}</div>
        </template>

        <template #email-data="{ row }">
          <div>{{ row.email }}</div>
        </template>
        <template #actions-data="{ row }">
          <UButton
            v-if="row.id === user.user.data[0].id"
            :variant="'soft'"
            color="green"
            @click="openModal(row)"
            >Edit</UButton
          >
          <div v-else></div>
        </template>
      </MSATable>
    </div>

    <UModal v-model="isOpenModal">
      <div class="p-4">
        <UForm
          :validate="validate"
          @submit="handleUpdate"
          :state="updateMemberState"
        >
          <UFormGroup
            class="mt-3"
            label="Nama"
            name="name"
            autocomplete="false"
            required
          >
            <UInput v-model="updateMemberState.name" />
          </UFormGroup>

          <UFormGroup
            class="mt-3"
            label="Nomer Handphone"
            name="phone"
            autocomplete="false"
            required
          >
            <UInput v-model="updateMemberState.phone" v-number />
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
import type { FormError, FormSubmitEvent } from '#ui/types'
const isOpen = ref(false)

const columns = ref([
  {
    key: 'name',
    label: 'Nama Warga',
  },
  {
    key: 'blok',
    label: 'Blok Rumah',
  },
  {
    key: 'phone',
    label: 'Nomer Hp',
  },
  {
    key: 'email',
    label: 'Email',
  },
  {
    key: 'actions',
    label: '',
  },
])

export interface IMember {
  id: string
  email: string
  name: string
  phone: string
  role: null
  blok: null
  house: string
}

// interface IMember {
//   data: datas[]
// }

// interface datas {
//   created_at: Date
//   id_complex: string
//   phone: number | null
//   id: string
//   id_warga: string
//   name_warga: string
//   blok: string
// }
const user = useGetuser()
const item = ref<IMember[]>()
const search = ref('')
const pending = ref(false)
const isOpenModal = ref(false)
const updateMemberState = ref({
  name: '',
  id: '',
  phone: '',
})

const vNumber = (e: HTMLDivElement) => {
  e.addEventListener('keydown', (event: KeyboardEvent) => {
    const checkNumber = event.key.match(/[0-9]/gm)

    const allowedKeys = ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight']

    if (!checkNumber && !allowedKeys.includes(event.key)) {
      event.preventDefault()
      return false
    }

    return true
  })
}

watchDebounced(
  () => search.value,
  (newValue) => {
    getData(newValue)
  },
  { debounce: 500 }
)

async function getData(e?: string) {
  pending.value = true
  const { data } = await useFetch<{ data: IMember[] }>('/api/get-member', {
    query: {
      v: user.user && user.user.data[0]?.complex?.id,
      q: e ? e : '',
    },
  })
  pending.value = false
  item.value = data.value?.data
}
getData()

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Name Required' })
  if (!state.phone) errors.push({ path: 'phone', message: 'Phone Required' })
  return errors
}

function openModal(e: IMember) {
  isOpenModal.value = true
  updateMemberState.value = {
    id: e.id,
    name: e.name,
    phone: e.phone,
  }
}

async function handleUpdate() {
  const { status } = await useFetch<{ data: any }>('/api/settings-profile', {
    method: 'PUT',
    body: updateMemberState.value,
  })
  if (status.value === 'success') {
    isOpenModal.value = false
    getData()
  }
}
</script>

<style lang="scss" scoped></style>
