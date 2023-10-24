<script setup lang="ts">
import { ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'

const el = ref<HTMLElement | null>(null)
const dataItems = ref<any[]>([])
const dataEmpty = ref([])
const skip = ref(0)
const loading = ref(false)

let url = `https://dummyjson.com/users/search`

async function getItemsData() {
  loading.value = true
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
  loading.value = false
  if (error.value) return
  if (data.value?.users !== 0) {
    dataItems.value = [...dataItems.value, ...data.value?.users]
    dataEmpty.value = data.value?.users
  }
}
getItemsData()

useInfiniteScroll(
  () => el.value,
  async () => {
    if (dataEmpty.value.length === 0) return
    skip.value += 10
    await getItemsData()
  },
  { distance: 10 }
)
</script>

<template>
  <div
    ref="el"
    class="flex flex-row p-4 h-[500px] gap-5 justify-around flex-wrap m-auto overflow-y-scroll rounded"
  >
    <div v-for="item in dataItems" :key="item">
      <div class="h-15 bg-gray-500/5 rounded p-3 text-center">
        <img :src="item.image" />
        <div class="mt-8">
          {{ item.firstName }}
        </div>
      </div>
    </div>
    <div
      v-if="loading"
      v-for="_ in 3"
      class="h-15 bg-gray-500/5 rounded p-3 text-center mt-3"
    >
      <USkeleton class="h-72 w-72" :ui="{ rounded: 'rounded' }" />
      <USkeleton class="h-7 w-full mt-3" :ui="{ rounded: 'rounded' }" />
    </div>
  </div>
</template>
