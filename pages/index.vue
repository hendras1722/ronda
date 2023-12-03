<template>
  <div>
    <div class="mb-5">
      <UDivider class="mb-5">
        <div class="text-2xl">Warga: Perumahan</div>
      </UDivider>
      <div class="grid lg:grid-cols-2 grid-cols-1 grid-rows-1 gap-4">
        <div>
          <div
            class="w-full h-60 relative rounded-lg border-4 border-[#91adc2a0] bg-[#91adc2a0] flex items-center justify-center"
          >
            <div class="block text-center">
              <div class="text-5xl font-extrabold">
                {{ countDashboard?.total_warga }}
              </div>
              <div>Warga</div>
            </div>
          </div>
        </div>
        <div>
          <div
            class="w-full h-60 relative rounded-lg border-4 border-[#B0D0D3] bg-[#b0d0d3ab] flex items-center justify-center"
          >
            <div class="block text-center">
              <div class="text-5xl font-extrabold">
                {{ countDashboard?.total_money }}
              </div>
              <div>Total Iuran</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <UDivider class="mb-5">
        <div class="text-2xl">Hasil Jimpitan nih</div>
      </UDivider>
      <div>Tanggal</div>
      <div>
        <ClientOnly>
          <apexchart
            v-show="renderKey === 100"
            height="600"
            type="bar"
            :options="chartOptions"
            :series="series"
          ></apexchart>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const colorMode = useColorMode()
const renderKey = ref(0)
interface IGraphicCount {
  total_money: number
  total_warga: number
}
const store = storeToRefs(useGetuser())
// definePageMeta({
//   layout: false,
//   middleware: [
//     function () {
//       const { user } = storeToRefs(useGetuser())
//       if (!user.value.isComplex) {
//         return navigateTo('/settings-profile')
//       }
//     },
//   ],
// })
// console.log(store.user.value)

const { data } = await useFetch<{ data: IGraphicCount }>('/api/dashboard')
const countDashboard = computed(() => data.value?.data)

const renderTimeout = setTimeout(() => {
  renderKey.value = 100
  clearTimeout(renderTimeout)
}, 100)

const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
    background: 'transparent',
  },
  tooltip: {
    // theme: 'dark',
    followCursor: true,
  },
  theme: {
    mode: colorMode.value,
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    lines: {
      show: true,
    },
  },
  responsive: [
    {
      breakpoint: undefined,
      options: {},
    },
  ],
})

watch(
  () => colorMode.value,
  (e) => {
    chartOptions.value = {
      chart: {
        id: 'vuechart-example',
        background: 'transparent',
      },
      tooltip: {
        followCursor: true,
      },
      theme: {
        mode: e,
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        lines: {
          show: true,
        },
      },
      responsive: [
        {
          breakpoint: undefined,
          options: {},
        },
      ],
    }
  },
  {
    deep: true,
  }
)

const series = ref([
  {
    name: 'series-1',
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
])
</script>
