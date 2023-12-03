<template>
  <div class="p-10">
    <UContainer
      class="px-3 py-5 max-w-full bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-white dark:border dark:border-white"
    >
      <div v-if="step === 1">
        <UDivider class="mb-5">
          <div class="text-2xl">Lengkapi Profilmu</div>
        </UDivider>
        <p class="mb-5">
          Lengkapi profilmu bertujuan untuk memudahkan pendataan dikampungmu
        </p>
        <div>
          <div class="my-5">
            <div>Nama</div>
            <div><UInput v-model="formPersonal.name" /></div>
          </div>

          <div class="my-5">
            <div>Nomer Hp</div>
            <div><UInput v-model="formPersonal.phone" /></div>
          </div>
        </div>
      </div>
      <div v-if="step === 2">
        <UDivider class="mb-5">
          <div class="text-2xl">Masukkan Alamatmu</div>
        </UDivider>
        <div v-if="stepSearchAddress === 1">
          <div class="my-5 relative">
            <div>Cari Alamatmu</div>
            <div>
              <UInput
                :ui="{
                  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                }"
                v-model="search"
                @focus="handleFocus"
                @focusout="handleFocusOut"
              />
            </div>
            <div>
              Alamatmu belum tersedia ?
              <UButton class="mt-3" @click="stepSearchAddress = 2">
                Daftar sekarang</UButton
              >
            </div>

            <div
              v-if="isFocus"
              class="bg-white absolute shadow-md w-full rounded-lg p-5 mt-2"
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
            <div v-if="isResult" class="mt-5 font-bold">
              <div class="my-5">
                <div>Alamatmu</div>
                <div>
                  <UInput
                    :ui="{
                      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                    }"
                    v-model="formAddress.house_complex"
                    @keydown="handleKeyDown"
                    disabled
                  />
                </div>
              </div>

              <div class="my-5 flex gap-3">
                <div class="w-full">
                  <div>Rt</div>
                  <div>
                    <UInput
                      :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                      }"
                      v-model="formAddress.rt"
                      disabled
                      @keydown="handleKeyDown"
                    />
                  </div>
                </div>
                <div class="w-full">
                  <div>Rw</div>
                  <div>
                    <UInput
                      :ui="{
                        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                      }"
                      v-model="formAddress.rw"
                      disabled
                      @keydown="handleKeyDown"
                    />
                  </div>
                </div>
              </div>
              <div class="my-5">
                <div>Kelurahan</div>
                <div>
                  <UInput
                    :ui="{
                      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                    }"
                    v-model="formAddress.kelurahan"
                    disabled
                    @keydown="handleKeyDown"
                  />
                </div>
              </div>
              <div class="my-5">
                <div>Kecamatan</div>
                <div>
                  <UInput
                    :ui="{
                      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                    }"
                    v-model="formAddress.kecamatan"
                    disabled
                    @keydown="handleKeyDown"
                  />
                </div>
              </div>
              <div class="my-5">
                <div>Provinsi</div>
                <div>
                  <UInput
                    :ui="{
                      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                    }"
                    v-model="formAddress.provinsi"
                    disabled
                    @keydown="handleKeyDown"
                  />
                </div>
              </div>
              <div class="my-5">
                <div>kodepos</div>
                <div>
                  <UInput
                    :ui="{
                      base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-gray-300 focus:outline-none border-0',
                    }"
                    v-model="formAddress.kodepos"
                    disabled
                    @keydown="handleKeyDown"
                  />
                </div>
              </div>
              <div class="my-5">
                <div>blok</div>
                <div>
                  <UInput v-model="formPersonal.blok" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div>
            <div class="my-5">
              <div>Alamat</div>
              <div><UInput v-model="formAddress.house_complex" /></div>
            </div>

            <div class="my-5 flex gap-3">
              <div class="w-full">
                <div>Rt</div>
                <div><UInput v-model="formAddress.rt" /></div>
              </div>
              <div class="w-full">
                <div>Rw</div>
                <div><UInput v-model="formAddress.rw" /></div>
              </div>
            </div>
            <div class="my-5">
              <div>Kelurahan</div>
              <div><UInput v-model="formAddress.kelurahan" /></div>
            </div>
            <div class="my-5">
              <div>Kecamatan</div>
              <div><UInput v-model="formAddress.kecamatan" /></div>
            </div>
            <div class="my-5">
              <div>Provinsi</div>
              <div><UInput v-model="formAddress.provinsi" /></div>
            </div>
            <div class="my-5">
              <div>kodepos</div>
              <div><UInput v-model="formAddress.kodepos" /></div>
            </div>
            <div class="my-5">
              <div>blok</div>
              <div>
                <UInput v-model="formPersonal.blok" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <UButton
        :ui="{ base: 'w-full justify-center' }"
        variant="soft"
        color="primary"
        @click="handleSave(step)"
        class="mt-5"
        >Save</UButton
      >
    </UContainer>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin-only-navbar',
  middleware: [
    function () {
      const { user } = storeToRefs(useGetuser())
      if (user.value.isComplex) {
        return navigateTo('/')
      }
    },
  ],
})

const step = ref(1)
const stepSearchAddress = ref(1)
const search = ref('')
const isLoading = ref(false)
const getResult = ref<any[]>([])
const { userLogin } = storeToRefs(useGetuser())

interface TopLevel {
  name?: string
  id: string
  house_complex: string
  created_at: string
  updated_at: null
  rt: string
  provinsi: string
  kodepos: string
  kelurahan: string
  kecamatan: string
  rw: string
}

const formPersonal = ref({
  id: userLogin.value?.sub,
  phone: '',
  name: '',
  role: '',
  email: userLogin.value?.email,
  blok: '',
})

const formAddress = ref({
  house_complex: '',
  provinsi: '',
  kodepos: '',
  kelurahan: '',
  kecamatan: '',
  rt: '',
  rw: '',
})

const id_complex = ref('')
const isResult = ref(false)
const isFocus = ref(false)

const user = useGetuser()
onMounted(() => {
  if (!user.user.isComplex) {
    step.value = 2
  }
})

async function handleSave(e: number) {
  if (e === 2) {
    if (stepSearchAddress.value === 1) {
      const { data: profile } = await useFetch<{ data: TopLevel[] }>(
        '/api/settings-profile',
        {
          method: 'put',
          body: {
            house: id_complex.value,
            id: userLogin.value?.sub,
            blok: formPersonal.value.blok,
          },
          server: false,
          headers: {
            'Content-Type': 'application/json',
            id: userLogin.value?.sub || '',
          },
        }
      )
      console.log(profile.value?.data, 'inipros')
      if (profile.value?.data) {
        window.location.reload()
      }
      return
    }
    const { data: address } = await useFetch<{ data: TopLevel[] }>(
      '/api/settings-address',
      {
        method: 'post',
        body: { ...formAddress.value, blok: formPersonal.value.blok },
        server: false,
        headers: {
          'Content-Type': 'application/json',
          id: userLogin.value?.sub || '',
        },
      }
    )
    if (address.value?.data) {
      step.value = 2
    }
    console.log(address.value?.data, 'inipros')
    window.location.reload()
    return
  }
  const { data: profile } = await useFetch<{
    data: {
      id_complex: string
      id: string
      name: string
      blok: string
      phone: string
      id_warga: string
    }[]
  }>('/api/settings-profile', {
    method: 'POST',
    body: formPersonal.value,
    server: false,
    watch: false,
  })
  if (profile.value?.data) {
    step.value = 2
  }
}

function handleGetSearch(e: any) {
  search.value = e.name
  id_complex.value = e.id
  formAddress.value = { ...e, house_complex: e.name || '' }
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
</script>

<style scoped lang="scss">
.size {
  @apply w-full;
}
</style>
