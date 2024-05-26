<template>
  <div class="p-10">
    <div
      v-if="checkJimpitanDay"
      class="flex justify-center items-center min-h-screen"
    >
      <div>
        <img src="/undraw_departing_re_mlq3.svg" width="430" />
        <div class="mt-8 text-2xl text-center">
          Ini bukan hari mu untuk jimpitan
        </div>
        <div>
          <UButton
            class="w-full ml-auto mr-auto block mt-5"
            variant="solid"
            color="red"
            size="lg"
            @click="logout"
          >
            Keluar
          </UButton>
        </div>
      </div>
    </div>

    <UContainer
      v-else
      class="px-3 py-5 max-w-full bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-white dark:border dark:border-white"
    >
      <div class="flex justify-center">Jimpitan Hari</div>
      <div class="text-center mt-3 text-2xl font-extrabold">
        {{ getDaysNow() }}
      </div>

      <div class="text-center mt-5 grid place-items-center mb-5">
        <div class="flex justify-between items-center">
          <UButton @click="plusSlides(-1)">
            <UIcon
              :name="'i-ion-caret-back-outline'"
              class="sm:text-[58px] text-[32px]"
            ></UIcon>
          </UButton>
          <div class="slideshow-container relative">
            <UIcon
              :name="'i-ion-ios-home'"
              class="sm:text-[308px] text-[88px]"
            ></UIcon>
            <div>
              <div
                v-for="(itemData, index) in item"
                :key="index"
                class="absolute left-0 right-0 mx-0 top-0 bottom-0 my-0 sm:mt-32 mt-8 sm:text-xl text-[12px] uppercase text-white z-10"
              >
                <div class="mySlides fade font-extrabold">
                  {{ itemData.block }}
                </div>
              </div>
            </div>
          </div>
          <UButton @click="plusSlides(1)">
            <UIcon
              :name="'i-ion-caret-forward-outline'"
              class="sm:text-[58px] text-[32px]"
            ></UIcon>
          </UButton>
        </div>

        <UInput type="telp" v-model="money">
          <template #leading>
            <div>Rp</div>
          </template>
        </UInput>

        <div class="mt-5" v-if="!item?.[slideIndex - 1]?.date">
          <UButton
            variant="solid"
            color="primary"
            @click="handleSubmit"
            :loading="loading"
          >
            Ambil Jimpitan
          </UButton>
        </div>
      </div>

      <MSATable
        :loading="pending"
        :columns="columns"
        :rows="item"
        :ui="{
          base: 'rounded-lg border border-collapse border-tools-table-outline border-[#ccc] border-1 w-full',
          divide: 'divide-y divide-[#ccc] dark:divide-white',
        }"
      >
        <template #status-data="{ row }">
          <div>
            <div v-if="row.date">
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
          </div>
        </template>
      </MSATable>

      <div>
        <UButton
          class="w-full ml-auto mr-auto block mt-5"
          variant="solid"
          color="red"
          size="lg"
          @click="logout"
        >
          Keluar
        </UButton>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
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
        // window.location.href = pathname
        // return
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
          // return setTimeout(() => {
          //   navigateTo(pathname)
          // }, 300)
          // window.location.href = pathname
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
const slideIndex = ref(0)
const item = ref<any[]>([])
const money = ref(0)
const user = useGetuser()
const checkJimpitanDay = ref(false)
const pending = ref(false)

onMounted(() => {
  nextTick(() => {
    showSlides(slideIndex.value)
  })
})

// const sbAccessToken = useCookie('sb-access-token')
// sbAccessToken.value = null

// Next/previous controls
function plusSlides(n: number) {
  showSlides((slideIndex.value += n))
}

function getDaysNow() {
  let data = ['Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu', 'Minggu']
  let date = data[new Date().getDay() - 1]
  return date
}

function showSlides(n: number) {
  if (item.value.length < 1) return
  let i
  let slides = document.getElementsByClassName('mySlides') as any
  if (n > slides.length) {
    slideIndex.value = 1
  }
  if (n < 1) {
    slideIndex.value = slides.length
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none'
  }
  if (!slides[slideIndex.value - 1]) return
  slides[slideIndex.value - 1].style.display = 'block'
}

async function handleSubmit() {
  loading.value = true
  const dataJimpitan = item.value[slideIndex.value - 1]
  const path = route.path.replace('jimpitan-', '')
  const regex = path.replace(/^\//gm, '')

  const address = user.user.data.filter((item) => item.complex.link === regex)

  let obj = {
    id_address: dataJimpitan.id_complex,
    money: money.value,
    by: user?.userLogin?.sub,
    id_block: dataJimpitan.id,
  }
  const { data } = await useFetch<{ data: any }>('/api/jimpitan', {
    method: 'POST',
    body: obj,
  })
  if (data.value?.data) {
    const { data: getData } = await useFetch<{ data: any }>(
      '/api/get-jimpitan',
      {
        query: {
          q: address[0].complex.id,
        },
      }
    )
    if (getData.value?.data) {
      item.value = getData.value?.data
    }
  }
  loading.value = false
}
const router = useRouter()

async function logout() {
  let { error } = await supabase.auth.signOut()
  if (!error) {
    // const sbAccessToken = useCookie('sb-access-token')
    // const token = useCookie('token')
    // sbAccessToken.value = null
    // token.value = null
    window.location.href = window.location.pathname + '/login'
    // router.push('/login')
  }
}

async function getData() {
  pending.value = true
  const path = route.path.replace('jimpitan-', '')
  const regex = path.replace(/^\//gm, '')

  const address = user.user.data.filter((item) => item.complex.link === regex)
  const { data } = await useFetch<{ data: any[]; day: any[] }>(
    '/api/get-jimpitan',
    {
      query: {
        q: address[0].complex.id,
      },
    }
  )
  pending.value = false
  // console.log(data.value, 'inidata')
  // if (data.value?.day) {
  //   const getDay = data.value?.day.filter(
  //     (item: { day: number }) => item.day === new Date().getDay()
  //   )
  //   if (getDay.length < 1) {
  //     checkJimpitanDay.value = true
  //   }
  // }

  if (data.value?.data) {
    item.value = data.value.data
    // slideIndex.value = data.value?.data?.length || 0
  }
}
await getData()
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
