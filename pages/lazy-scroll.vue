<script setup lang="ts">
import { ref } from 'vue'
import { useInfiniteScroll, useVirtualList } from '@vueuse/core'

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
      limit: 10,
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
await getItemsData()

const { list, containerProps, wrapperProps } = useVirtualList(dataItems, {
  itemHeight: 1,
})

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
  <div v-bind="containerProps">
    <div v-bind="wrapperProps" class="!h-[500px]">
      <div ref="el" class="overflow-auto flex flex-wrap h-[500px] gap-16">
        <div v-for="(item, index) in list" :key="index + ' ' + item.data">
          <div class="h-15 bg-gray-500/5 rounded p-3 text-center">
            {{ item.data.id }}
            <img :src="item.data.image" />
            <div class="mt-8">
              {{ item.data.firstName }}
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

      <!-- </div> -->
    </div>
  </div>
</template>
