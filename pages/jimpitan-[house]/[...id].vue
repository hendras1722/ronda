<template>
  <div class="p-10 overflow-auto max-h-screen">
    <div v-if="checkJimpitanDay" class="flex justify-center items-center min-h-screen">
      <div>
        <img src="/undraw_departing_re_mlq3.svg" width="430" alt="ronda_logo" />
        <div class="mt-8 text-2xl text-center">
          Ini bukan hari mu untuk jimpitan
        </div>
        <div>
          <UButton class="w-full ml-auto mr-auto block mt-5" variant="solid" color="blue" size="lg" @click="handlePush">
            Masuk Dashboard
          </UButton>
          <UButton class="w-full ml-auto mr-auto block mt-5" variant="solid" color="red" size="lg" @click="logout">
            Keluar
          </UButton>
        </div>
      </div>
    </div>

    <UContainer v-else
      class="px-3 py-5 max-w-full bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-white dark:border dark:border-white">
      <div class="flex justify-center">Jimpitan Hari</div>
      <div class="text-center mt-3 text-2xl font-extrabold">
        {{ getDaysNow() }}
      </div>

      <div class="text-center mt-5 grid place-items-center mb-5">
        <ImageSlider :item="item" v-model="slideIndex" />

        <div class="grid place-items-center mt-5">
          <UPopover :popper="{ placement: 'bottom' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(date, 'd MMM, yyy')"
              class="border boder-black" />

            <template #panel="{ close }">
              <Datepicker v-model="date" is-required @close="close" :max-date="new Date()" />
            </template>
          </UPopover>

          <div class="mt-3" v-if="isTwoDaysAgo">
            <InputCurrency v-model="money">
              <template #append> Rp </template>
            </InputCurrency>
          </div>

          <div class="mt-5" v-if="!slideIndex?.date && isTwoDaysAgo">
            <UButton variant="solid" color="primary" @click="handleSubmit" :loading="loading" :disabled="loading">
              Ambil Jimpitan
            </UButton>
          </div>
        </div>
      </div>

      <MSATable :loading="pending" :columns="columns" :rows="item" :ui="{
        base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
        divide: 'divide-y divide-[#ccc] dark:divide-white',
      }">
        <template #status-data="{ row }">
          <div>
            <div v-if="row.date">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                <path fill="#61e563"
                  d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58Z" />
              </svg>
            </div>
            <div v-else>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                <path fill="#fafafa"
                  d="M400 48H112a64.07 64.07 0 0 0-64 64v288a64.07 64.07 0 0 0 64 64h288a64.07 64.07 0 0 0 64-64V112a64.07 64.07 0 0 0-64-64Zm-35.75 138.29l-134.4 160a16 16 0 0 1-12 5.71h-.27a16 16 0 0 1-11.89-5.3l-57.6-64a16 16 0 1 1 23.78-21.4l45.29 50.32l122.59-145.91a16 16 0 0 1 24.5 20.58Z" />
              </svg>
            </div>
          </div>
        </template>
      </MSATable>

      <p class="mt-3">Total: {{ totalMoney }}</p>

      <div>
        <UButton class="w-full ml-auto mr-auto block mt-5" variant="solid" color="blue" size="lg" @click="handlePush">
          Masuk Dashboard
        </UButton>
        <UButton class="w-full ml-auto mr-auto block mt-5" variant="solid" color="red" size="lg" @click="logout">
          Keluar
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import {
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
  subDays,
} from 'date-fns'


export interface InterfaceSlideindex {
  id: string;
  id_complex: string;
  block: string;
  money: number;
  name: null;
  date: null;
}


definePageMeta({
  layout: false,
  middleware: [
    async function (from, to) {
      const user = useGetuser()
      const path = from.path.replace('jimpitan-', '')
      const regex = path.replace(/^\//gm, '')
      const sbAccessToken = useCookie('sb-access-token')
      const jwt = sbAccessToken.value
      const pathname = from.path + '/login'
      const address = user.user.data.filter(
        (item) => item.complex && item.complex.link === regex
      )
      if (!jwt) {
        return navigateTo(pathname)

      }
      if (address.length < 1) {
        return abortNavigation({
          statusCode: 403,
          statusMessage: 'Forbidden access',
        })
      }
      if (process.client) {
        const data = parseJwt(jwt)
        if (Date.now() >= data.exp * 1000) {

          return navigateTo(pathname)
        }
      }
    },
  ],
})
const route = useRoute()
const loading = ref(false)
const columns = ref([
  {
    key: 'block',
    label: 'Rumah Blok',
  },
  {
    key: 'status',
    label: 'Status',
  },
])
const slideIndex = ref<InterfaceSlideindex>()
const item = ref<any[]>([])
const money = ref('')
const user = useGetuser()
const checkJimpitanDay = ref(false)
const pending = ref(false)
const totalMoney = ref(0)
const date = ref(new Date())
const isTwoDaysAgo = computed(() => {
  return isWithinInterval(new Date(date.value), {
    start: subDays(new Date(), 3),
    end: new Date(),
  })
})


function getDaysNow() {
  let data = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu']
  let date = data[new Date().getDay() - 1]
  return date
}

async function handleSubmit() {
  loading.value = true
  totalMoney.value = 0
  const dataJimpitan = slideIndex.value as InterfaceSlideindex

  const path = route.path.replace('jimpitan-', '')
  const regex = path.replace(/^\//gm, '')

  const address = user.user.data.filter((item) => item.complex.link === regex)

  let obj = {
    id_address: dataJimpitan.id_complex,
    money: money.value.replace(/\W/gm, ''),
    by: user?.userLogin?.sub,
    id_block: dataJimpitan.id,
    created_at: new Date(date.value).toISOString(),
  }

  const { data } = await useFetch<{ data: any }>('/api/jimpitan', {
    method: 'POST',
    body: obj,
  })
  if (data.value?.data) {
    const { data: getData } = await useFetch<{ data: any; money: number }>(
      '/api/get-jimpitan',
      {
        query: {
          q: address[0].complex.id,
          created_at: date.value,
        },
      }
    )
    nextTick(() => {
      if (getData.value?.data) {
        item.value = getData.value?.data.sort((a: any, b: any) => {
          const blockA = a.block.toUpperCase(); // Mengabaikan case
          const blockB = b.block.toUpperCase(); // Mengabaikan case

          // Pertama, urutkan berdasarkan huruf (H atau I)
          if (blockA[0] < blockB[0]) {
            return -1;
          }
          if (blockA[0] > blockB[0]) {
            return 1;
          }

          // Jika huruf sama, urutkan berdasarkan angka
          const numberA = parseInt(blockA.slice(1)); // Ambil angka setelah huruf
          const numberB = parseInt(blockB.slice(1)); // Ambil angka setelah huruf

          return numberA - numberB;
        });
        totalMoney.value = (data.value as { data: any; money: number })?.money
        // showSlides(1)
      }
    })
  }
  loading.value = false
  getData()
}

const router = useRouter()
function handlePush() {
  router.push('/admin/dashboard')
}

async function logout() {
  let { error } = await supabase.auth.signOut()
  if (!error) {
    window.location.href = window.location.pathname + '/login'
  }
}

function vMoney(e: HTMLInputElement) {
  e.addEventListener('keyup', (event) => {
    let input = (event.target as any).value.replace(/\D/g, '') // Hanya angka
    if (/^0/gm.test(input)) {
      ; (event.target as any).value = ''
      return
    }
    let formattedInput = ''

    // Mengatur input seperti format uang Rupiah (IDR)
    if (input.length <= 3) {
      formattedInput = input
    } else {
      let remainder = input.length % 3
      formattedInput = input.substr(0, remainder)

      for (let i = remainder; i < input.length; i += 3) {
        if (i !== 0) formattedInput += '.'
        formattedInput += input.substr(i, 3)
      }
    }

    ; (event.target as any).value = formattedInput
  })
}

async function getData() {
  pending.value = true
  const path = route.path.replace('jimpitan-', '')
  const regex = path.replace(/^\//gm, '')
  const idSupabase = useSupabaseUser()
  const address = user.user.data.filter((item) => item.complex.link === regex)

  const { data } = await useFetch<{ data: any[]; day: any[]; money: number }>(
    '/api/get-jimpitan',
    {
      query: {
        q: address[0].complex.id,
        id: idSupabase.value?.id,
        dateStart: startOfDay(date.value),
        dateEnd: endOfDay(date.value),
      },
    }
  )

  pending.value = false

  if (data.value && data.value?.day.length < 1) {
    checkJimpitanDay.value = true
    return
  }

  if (data.value && data.value?.day.length > 0) {
    const getDay = data.value?.day.filter(
      (item: { day: number }) => item.day === new Date().getDay()
    )
    if (getDay.length < 1) {
      checkJimpitanDay.value = true
    }
  }

  if (data.value?.data) {
    item.value = data.value.data.sort((a: any, b: any) => {
      const blockA = a.block.toUpperCase(); // Mengabaikan case
      const blockB = b.block.toUpperCase(); // Mengabaikan case

      // Pertama, urutkan berdasarkan huruf (H atau I)
      if (blockA[0] < blockB[0]) {
        return -1;
      }
      if (blockA[0] > blockB[0]) {
        return 1;
      }

      // Jika huruf sama, urutkan berdasarkan angka
      const numberA = parseInt(blockA.slice(1)); // Ambil angka setelah huruf
      const numberB = parseInt(blockB.slice(1)); // Ambil angka setelah huruf

      return numberA - numberB;
    });
    totalMoney.value = data.value?.money
  }
}
onMounted(() => {
  nextTick(async () => {
    await getData()
    // plusSlides(1)
  })
})

const formatUang = (value: string): string => {
  const angkaBersih = value.replace(/[^\d]/g, '')
  if (angkaBersih === '') return ''
  return angkaBersih.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const rawInput = ref('') // Input asli sebelum diformat

function keyPress(e: any) {
  if (!e) return
  const input = e.target as HTMLInputElement
  const cleanedValue = input.value.replace(/[^\d]/g, '')
  rawInput.value = cleanedValue.replace(/^0+(?!$)/, '')
  input.value = String(formatUang(rawInput.value)) // Format nilai input
}



watch(
  () => date.value,
  async () => {
    getData()
  }
)
</script>

<style scoped lang="scss">
/* Slideshow container */
.slideshow-container {
  max-width: 1000px;
  position: relative;
  margin: auto;
}

/* Hide the images by default */
.mySlides {
  display: none;
}

/* Next & previous buttons */
.prev,
.next {
  cursor: pointer;
  position: absolute;
  top: 50%;
  width: auto;
  margin-top: -22px;
  padding: 16px;
  color: white;
  font-weight: bold;
  font-size: 18px;
  transition: 0.6s ease;
  border-radius: 0 3px 3px 0;
  user-select: none;
}

/* Position the "next button" to the right */
.next {
  right: 0;
  border-radius: 3px 0 0 3px;
}

/* On hover, add a black background color with a little bit see-through */
.prev:hover,
.next:hover {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Caption text */
.text {
  color: #f2f2f2;
  font-size: 15px;
  padding: 8px 12px;
  position: absolute;
  bottom: 8px;
  width: 100%;
  text-align: center;
}

/* Number text (1/3 etc) */
.numbertext {
  color: #f2f2f2;
  font-size: 12px;
  padding: 8px 12px;
  position: absolute;
  top: 0;
}

/* The dots/bullets/indicators */
.dot {
  cursor: pointer;
  height: 15px;
  width: 15px;
  margin: 0 2px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.6s ease;
}

.active,
.dot:hover {
  background-color: #717171;
}

/* Fading animation */
.fade {
  animation-name: fade;
  animation-duration: 1.5s;
}

@keyframes fade {
  from {
    opacity: 0.4;
  }

  to {
    opacity: 1;
  }
}
</style>
