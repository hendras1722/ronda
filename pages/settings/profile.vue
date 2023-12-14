<template>
  <div>
    <UDivider label="Profile" />
    <div class="mb-3">
      <div>Nama</div>
      <div><UInput /></div>
    </div>
    <div class="mb-3">
      <div>Nomor Handphone</div>
      <div><UInput /></div>
    </div>
    <UDivider label="Alamat" />
    <div>
      <div>Blok</div>
      <div><UInput /></div>
    </div>
    <div class="mt-3 relative">
      <div>Tambah Alamat</div>
      <UInput
        :ui="{
          base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
        }"
        v-model="search"
        @focus="handleFocus"
        @focusout="handleFocusOut"
      />
      <div
        v-if="isFocus"
        class="bg-white absolute shadow-md w-full rounded-lg p-5 -mt-8"
      >
        <div v-if="isLoading">Data sedang dicari...</div>
        <UButton
          v-for="(item, index) in getResult"
          :key="index"
          class="w-full"
          @click="handleGetSearch(item)"
        >
          <div class="truncate">
            {{ item.name }} Rt {{ item.rt }} Rw {{ item.rw }}
            {{ item.kecamatan }} {{ item.kelurahan }} {{ item.provinsi }}
            {{ item.kodepos }}
          </div>
        </UButton>
      </div>
      <div class="mt-3">
        <div>Alamat Rumah</div>
        <ul class="list-disc ml-4">
          <li v-for="(item, i) in user.user.data" :key="i">
            {{ item.complex.house_complex }}
          </li>
        </ul>
        <!-- {{ user.user }} -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface IMember {
  data: datas[]
}

interface datas {
  created_at: Date
  id_complex: string
  phone: number | null
  id: string
  id_warga: string
  name_warga: string
  blok: string
}
definePageMeta({
  layout: 'settings',
})

const isResult = ref(false)
const isFocus = ref(false)
const search = ref('')
const isLoading = ref(false)
const id_complex = ref('')
const getResult = ref<any[]>([])
const user = useGetuser()
const item = ref()

function handleGetSearch(e: any) {
  search.value = e.name
  id_complex.value = e.id
  isResult.value = true
}

function handleFocus() {
  isFocus.value = true
}
function handleFocusOut() {
  const i = setTimeout(() => {
    isFocus.value = false
    clearTimeout(i)
  }, 350)
}

function handleKeyDown(e: Event) {
  e.preventDefault()
  return false
}

watchDebounced(
  () => search.value,
  async (newValue) => {
    if (!newValue) return
    isLoading.value = true
    const { data } = await useFetch<{ data: any[] }>('/api/search-address', {
      method: 'GET',
      query: {
        search: newValue,
      },
    })
    isLoading.value = false
    if (data.value && data.value?.data.length > 0) {
      getResult.value = data.value.data
    }
  },
  { debounce: 500 }
)

async function getData(e?: string) {
  const { data } = await useFetch<{ data: IMember[] }>('/api/get-member', {
    query: {
      v: user.user && user.user.data[0]?.complex?.id,
      q: e ? e : '',
    },
  })
  item.value = data.value?.data
}
getData()
</script>

<style lang="scss" scoped></style>
