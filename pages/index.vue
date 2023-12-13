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
                {{ countDashboard?.warga }}
              </div>
              <div>Total Warga</div>
            </div>
          </div>
        </div>
        <div>
          <div
            class="w-full h-60 relative rounded-lg border-4 border-[#B0D0D3] bg-[#b0d0d3ab] flex items-center justify-center"
          >
            <div class="block text-center">
              <div class="flex items-center">
                <div>
                  <div class="text-4xl font-extrabold">
                    {{ countDashboard?.contribution }}
                  </div>
                  <div>Total Iuran</div>
                </div>
                <div class="sm:ml-8 ml-5 border-l-2 border-l-white pl-5">
                  <div class="mb-5">
                    <div class="text-3xl font-extrabold">
                      {{ countDashboard?.danaMasuk.contribution }}
                    </div>
                    <div>Total Dana Masuk</div>
                  </div>
                  <div>
                    <div class="text-2xl font-extrabold">
                      {{ countDashboard?.danaKeluar.contribution }}
                    </div>
                    <div>Total Dana Keluar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <UDivider class="mb-5">
        <div class="text-2xl">Hasil Jimpitan nih</div>
      </UDivider>
      <div class="grid place-items-end">
        <div class="w-52 mb-3">
          <VDatePicker
            :popover="popover"
            v-model.range="date"
            :locale="{ masks: { input: 'DD/MM/YYYY' } }"
          >
            <template #default="{ inputValue, inputEvents }">
              <UInput
                :value="inputValue.start + '-' + inputValue.end"
                v-on="inputEvents.start"
              />
            </template>
          </VDatePicker>
        </div>
      </div>
      <div class="-z-10">
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
import { format } from 'date-fns'
const colorMode = useColorMode()
const renderKey = ref(0)
interface IGraphicCount {
  contribution: number
  warga: number
  graphicData: string[]
  graphicDate: string[]
  danaMasuk: { contribution: number[] }
  danaKeluar: { contribution: number[] }
}
const datePrev = new Date()

const date = ref({
  start: format(
    new Date(datePrev.setDate(datePrev.getDate() - 7)),
    'dd MMMM yyyy'
  ),
  end: format(new Date(), 'dd MMMM yyyy'),
})
const countDashboard = ref<IGraphicCount>()

const user = useGetuser()

const popover = {
  visibility: 'click',
  placement: 'bottom-end',
}
console.log(user.user)

const { data } = await useFetch<{ data: IGraphicCount }>('/api/dashboard', {
  query: {
    v: user.user && user.user.data[0]?.complex?.id,
    dateStart: format(new Date(date.value.start), 'dd MMMM yyyy'),
    dateEnd: format(new Date(date.value.end), 'dd MMMM yyyy'),
  },
})
countDashboard.value = data.value?.data

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
    categories: countDashboard.value?.graphicDate || [],
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

const series = ref([
  {
    name: 'Jimpitan',
    data: countDashboard.value?.graphicData || [],
  },
])

watch(
  () => date.value,
  async (newValue) => {
    const { data } = await useFetch<{ data: IGraphicCount }>('/api/dashboard', {
      query: {
        v: user.user && user.user.data[0]?.complex?.id,
        dateStart: format(new Date(newValue.start), 'dd MMMM yyyy'),
        dateEnd: format(new Date(newValue.end), 'dd MMMM yyyy'),
      },
    })
    countDashboard.value = data.value?.data
    series.value = [
      {
        name: 'Jimpitan',
        data: countDashboard.value?.graphicData || [],
      },
    ]

    chartOptions.value = {
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
        categories: countDashboard.value?.graphicDate || [],
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
  }
)

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
        categories: countDashboard.value?.graphicDate || [],
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
</script>

<style lang="scss">
@import url('@/assets/scss/calendar.scss');
</style>
