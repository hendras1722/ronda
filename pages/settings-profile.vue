<template>
  <div class="p-10">
    <UContainer
      class="px-3 py-5 max-w-full bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-white dark:border dark:border-white"
    >
      <UDivider class="mb-5">
        <div class="text-2xl">Lengkapi Profilmu</div>
      </UDivider>
      <p class="mb-5">
        Lengkapi profilmu bertujuan untuk memudahkan pendataan dikampungmu
      </p>
      <div class="relative" v-if="!register">
        <div class="mb-5">
          <div class="text-2xl">Cari alamat rumahmu</div>
          <div>
            <UInput
              v-model="search"
              @focus="handleFocus"
              @focusout="handleBlur"
            />
          </div>
          <small class="text-blue-500 font-extrabold"
            >Alamatmu belum ada ?
            <button class="text-black" @click="Register">Register</button>
          </small>
        </div>
        <div
          id="items_address"
          v-show="isFocus && search"
          class="w-full h-auto -mt-8 absolute bg-white z-10 border-2 border-blue-500 rounded-lg py-3 transition"
        >
          <div v-if="isLoading">please Wait</div>
          <div v-else-if="checkResult" class="text-center block">
            <div class="text-2xl font-extrabold">
              Yah alamatmu belum tersedia nih. silahkan register alamatmu
              terlebih dahulu
            </div>
            <UButton variant="soft" color="blue" class="mt-5" @click="Register"
              >Daftar</UButton
            >
          </div>

          <UButton
            v-else
            class="w-full"
            @click="handleSelect(item)"
            v-for="(item, index) in result"
            :key="index"
          >
            <div class="px-4">
              <div class="text-left truncate">
                {{ item.name }} Rt {{ item.rt }}/{{ item.rw }}
                {{ item.kelurahan }}
                {{ item.kecamatan }}
              </div>
            </div>
          </UButton>
        </div>
        <div v-if="isSearch">
          <div class="my-5">
            <div>Nama</div>
            <div><UInput v-model="formPersonal.name_warga" /></div>
          </div>
          <div class="my-5">
            <div>Blok Rumah</div>
            <div><UInput v-model="formPersonal.blok" /></div>
          </div>
          <div class="my-5">
            <div>Nomer Hp</div>
            <div><UInput v-model="formPersonal.phone" /></div>
          </div>
          <UButton
            :ui="{ base: 'w-full justify-center' }"
            variant="soft"
            color="primary"
            @click="handleSave"
            class="mt-5"
            >Save</UButton
          >
        </div>
      </div>
      <div v-else>
        <div class="mb-3">
          <div>Masukkan alamat rumah</div>
          <div>
            <UInput
              v-model="formAddress.house_complex"
              :disabled="isDisabledAddress"
            />
          </div>
        </div>
        <div class="grid xl:grid-cols-5 grid-rows-1 gap-4 grid-cols-1">
          <div>
            <div>Rt</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.rt"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
          <div>
            <div>Rw</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.rw"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
          <div>
            <div>Kelurahan</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.kelurahan"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
          <div>
            <div>Kecamatan</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.kecamatan"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
          <div>
            <div>kodepos</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.kodepos"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
          <div>
            <div>Provinsi</div>
            <div>
              <UInput
                class="size"
                v-model="formAddress.provinsi"
                :disabled="isDisabledAddress"
              />
            </div>
          </div>
        </div>
        <div v-if="isSaveRegisterAddress">
          <div class="my-5">
            <div>Nama</div>
            <div><UInput v-model="formPersonal.name_warga" /></div>
          </div>
          <div class="my-5">
            <div>Blok Rumah</div>
            <div><UInput v-model="formPersonal.blok" /></div>
          </div>
          <div class="my-5">
            <div>Nomer Hp</div>
            <div><UInput v-model="formPersonal.phone" /></div>
          </div>
        </div>
        <UButton
          :ui="{ base: 'w-full justify-center' }"
          variant="soft"
          color="primary"
          @click="handleSave"
          class="mt-5"
          >Save</UButton
        >
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { supabase } from '@/utils/supabase'

definePageMeta({
  layout: false,
})

interface IComplex {
  house_complex: string
  kecamatan: string
  kelurahan: string
  kodepos: string
  provinsi: string
  rt: string
  rw: string
}

interface Fx0ZEBVnkE {
  id: string
  name: string
  kecamatan: string
  kelurahan: string
  kodepos: string
  provinsi: string
  rt: string
  rw: string
}

// Generated by https://quicktype.io

interface TopLevel {
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

const result = ref<Fx0ZEBVnkE[]>([])
const search = ref('')
const formAddress = ref<IComplex>({
  kecamatan: '',
  kelurahan: '',
  kodepos: '',
  provinsi: '',
  rt: '',
  rw: '',
  house_complex: '',
})
const formPersonal = ref({
  id_complex: '',
  phone: '',
  id_warga: '',
  name_warga: '',
  blok: '',
})
const isFocus = ref(false)
const checkResult = ref(false)
const register = ref(false)
const isSearch = ref(false)
const isLoading = ref(false)
const isSaveRegisterAddress = ref(false)
const isDisabledAddress = ref(false)

watchDebounced(
  () => search.value,
  async (newValue) => {
    checkResult.value = false
    if (!newValue) return
    isLoading.value = true
    const { data } = await useFetch<{ data: Fx0ZEBVnkE[] }>(
      '/api/search-address',
      {
        method: 'GET',
        query: {
          search: newValue,
        },
      }
    )
    if (data.value && data.value?.data.length < 1) {
      checkResult.value = true
    }
    isLoading.value = false
    result.value = data.value?.data as Fx0ZEBVnkE[]
  },
  { debounce: 500 }
)

watch(
  () => search.value,
  () => {
    if (!search.value) {
      isSearch.value = false
    }
  }
)

function Register() {
  register.value = !register.value
}

function handleBlur() {
  setTimeout(() => {
    isFocus.value = false
  }, 300)
}

function handleFocus() {
  isFocus.value = true
}

function handleSelect(e: Fx0ZEBVnkE) {
  search.value = e.name
  formPersonal.value.id_complex = e.id
  isSearch.value = true
  handleBlur()
}

async function handleSave() {
  try {
    const { data } = await useFetch<{ user: any }>('/api/user', {
      method: 'GET',
    })
    formPersonal.value.id_warga = data.value?.user?.id || ''
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: String(error) })
    return
  }
  if (register.value) {
    isSaveRegisterAddress.value = !isSaveRegisterAddress.value
    if (isSaveRegisterAddress.value) {
      const { data: address } = await useFetch<{ data: TopLevel[] }>(
        '/api/save-address',
        {
          method: 'POST',
          body: formAddress.value,
        }
      )
      if (address.value?.data) {
        isDisabledAddress.value = true
      }
      formPersonal.value.id_complex = address.value?.data[0].id || ''

      return
    }
    const { data: address } = await useFetch<{ data: TopLevel[] }>(
      '/api/settings-profile',
      {
        method: 'POST',
        body: formPersonal.value,
      }
    )
    if (address.value?.data) {
      navigateTo('/')
    }

    return
  }
  const { data: address } = await useFetch<{ data: TopLevel[] }>(
    '/api/settings-profile',
    {
      method: 'POST',
      body: formPersonal.value,
    }
  )
  if (address.value?.data) {
    navigateTo('/')
  }
}
</script>

<style scoped lang="scss">
.size {
  @apply w-full;
}
</style>
