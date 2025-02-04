<template>
  <div class="overflow-x-scroll">
    <div class="text-2xl font-extrabold mb-5">Ambil Jimpitan</div>

    <div class="flex justify-between items-center flex-wrap mb-5 mt-5 gap-3">
      <div>
        Link jimpitan:
        <a
          class="text-blue-500"
          :href="'/jimpitan-' + user.user.data[0].complex.link"
          target="”_blank”"
          ><i>/jimpitan-{{ user.user.data[0].complex.link }}</i></a
        >
      </div>

      <div class="flex items-center gap-3">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            icon="i-heroicons-calendar-days-20-solid"
            :label="format(date, 'd MMM, yyy')"
          />

          <template #panel="{ close }">
            <Datepicker v-model="date" is-required @close="close" />
          </template>
        </UPopover>
        <UButton variant="solid" color="green" @click="handleOpen"
          >Tambah</UButton
        >
      </div>
    </div>

    <MSATable
      :columns="columns"
      :rows="item"
      :loading="loading"
      :ui="{
        base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
        divide: 'divide-y divide-[#ccc] dark:divide-white',
      }"
    >
      <template #blok-data="{ row }">
        <div>{{ row.block }}</div>
      </template>
      <template #by-data="{ row }">
        <div>{{ row?.name }}</div>
      </template>
      <template #status-data="{ row }">
        <div v-if="row?.date">
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

    <UModal v-model="isOpen">
      <div class="p-5 flex justify-center">
        <UForm :state="{ block: '' }" @submit="handleAdd">
          <UFormGroup label="Block Rumah | Nomer Rumah" name="block">
            <div class="flex">
              <div v-for="(_, i) in stateBlock" :key="i">
                <div v-if="i === 0" class="mr-8">
                  <UInput
                    type="telp"
                    class="w-14 ml-3"
                    v-model="stateBlock[i]"
                  />
                </div>

                <div v-else class="ml-5">
                  <UInput class="w-14" v-model="stateBlock[i]" v-number />
                </div>
              </div>
              <!-- <UInput
                v-number
                type="telp"
                class="w-14 ml-3"
                v-model="stateBlock"
              /> -->
            </div>
          </UFormGroup>

          <div class="flex justify-center mt-5">
            <UButton type="submit" color="green" variant="solid">
              Submit
            </UButton>
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { endOfDay, format, startOfDay } from 'date-fns'

const columns = ref([
  {
    key: 'blok',
    label: 'Rumah Blok',
  },
  {
    key: 'by',
    label: 'Diambil oleh',
  },
  {
    key: 'status',
    label: 'Status',
  },
])

const user = useGetuser()
const isOpen = ref(false)

const item = ref<any>([])
const stateBlock = ref(['', ''])
const date = ref(new Date())
const loading = ref(false)

function handleOpen() {
  isOpen.value = true
}
async function getData() {
  loading.value = true
  const { data } = await useFetch<{ data: any[] }>('/api/get-jimpitan', {
    query: {
      q: user.user && user.user.data[0]?.complex.id,
      dateStart: startOfDay(date.value),
      dateEnd: endOfDay(date.value),
    },
  })
  loading.value = false
  item.value = data.value?.data
}
await getData()

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

async function handleAdd() {
  const itemBlock = stateBlock.value.join('')
  const { data } = await useFetch<{ data: any }>('/api/block', {
    method: 'POST',
    body: {
      id_complex: user.user && user.user.data[0]?.complex?.id,
      block: itemBlock,
    },
  })
  if (data.value?.data) {
    getData()
    isOpen.value = false
  }
  // console.log(data.value)
}

watch(
  () => date.value,
  async () => {
    getData()
  }
)
</script>

<style lang="scss" scoped></style>
