<script setup lang="ts">
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const dataItems = ref<any[]>([])
const dataEmpty = ref([])
const skip = ref(0)

let url = `https://dummyjson.com/users/search`

async function getItemsData() {
  const { data, error } = await useFetch<{
    users: any
    total: number
  }>(url, {
    params: {
      q: '',
      skip: skip.value,
    },
    lazy: false,
  })
  if (error.value) return
  if (data.value?.users !== 0) {
    dataItems.value = [...dataItems.value, ...data.value?.users]
    dataEmpty.value = data.value?.users
  }
}
await getItemsData()

useInfiniteScroll(
  () => el.value,
  async () => {
    if (dataEmpty.value.length === 0) return
    skip.value += 10
    await getItemsData()
  },
  { distance: 1000 }
)
</script>

<template>
  <div
    ref="el"
    class="flex flex-col gap-2 p-4 w-[300px] h-[300px] m-auto overflow-y-scroll bg-gray-500/5 rounded"
  >
    <div
      v-for="item in dataItems"
      :key="item"
      class="h-15 bg-gray-500/5 rounded p-3"
    >
      {{ item.firstName }}
    </div>
  </div>
</template>
