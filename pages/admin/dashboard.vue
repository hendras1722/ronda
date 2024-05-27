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
                {{ countDashboard?.warga || 0 }}
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
                    {{ countDashboard?.contribution || 0 }}
                  </div>
                  <div>Total Iuran</div>
                </div>
                <div class="sm:ml-8 ml-5 border-l-2 border-l-white pl-5">
                  <div class="mb-5">
                    <div class="text-3xl font-extrabold">
                      {{ countDashboard?.danaMasuk.contribution || 0 }}
                    </div>
                    <div>Total Dana Masuk</div>
                  </div>
                  <div>
                    <div class="text-2xl font-extrabold">
                      {{ countDashboard?.danaKeluar.contribution || 0 }}
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
import debounce from '@/utils/debounce'

interface IGraphicCount {
  contribution: number
  warga: number
  graphicData: string[]
  graphicDate: string[]
  danaMasuk: { contribution: number[] }
  danaKeluar: { contribution: number[] }
}
const colorMode = useColorMode()
const renderKey = ref(0)
const datePrev = new Date()

const date = ref({
  start: format(
    new Date(datePrev.setDate(datePrev.getDate() - 7)),
    'dd MMMM yyyy'
  ),
  end: format(new Date(), 'dd MMMM yyyy'),
})
const countDashboard = ref<IGraphicCount>()

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

const user = useGetuser()

const popover = {
  visibility: 'click',
  placement: 'bottom-end',
}

async function getDataDebounce() {
  const date1 = new Date(date.value.start)
  const date2 = new Date(date.value.end)
  const data = await $fetch<{ data: IGraphicCount }>('/api/dashboard', {
    method: 'GET',
    query: {
      v: user.user && user.user.data[0]?.complex?.id,
      // dateStart: format(new Date(date.value.start), 'dd MMMM yyyy'),
      dateStart: format(date1, 'yyyy-MM-dd'),
      // dateEnd: format(new Date(newValue.end), 'dd MMMM yyyy'),
      dateEnd: format(date2, 'yyyy-MM-dd'),
    },
  })
  nextTick(() => {
    countDashboard.value = data.data
    series.value = [
      {
        name: 'Jimpitan',
        data: data.data?.graphicData || [],
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
        categories: data.data?.graphicDate || [],
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
  })
}

const debounceGetData = debounce(getDataDebounce, 500)

async function getData() {
  debounceGetData()
}
await getData()

const renderTimeout = setTimeout(() => {
  renderKey.value = 100
  clearTimeout(renderTimeout)
}, 100)

watch(
  () => date.value,
  async () => {
    getData()
  },
  {
    deep: true,
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
