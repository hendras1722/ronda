<template>
  <div>Total Reservue</div>
  <div>
    <ClientOnly>
      <apexchart
        v-show="renderKey === 100"
        height="500"
        type="bar"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </ClientOnly>
  </div>
</template>

<script lang="ts" setup>
const renderKey = ref(0)
setTimeout(() => {
  renderKey.value = 100
}, 100)
const chartOptions = ref({
  chart: {
    id: 'vuechart-example',
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
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
    name: 'series-1',
    data: [30, 40, 35, 50, 49, 60, 70, 91],
  },
])
</script>
