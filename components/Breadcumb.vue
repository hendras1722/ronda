<template>
  <div class="border-b border-b-gray-100 flex">
    <div v-for="(item, i) in breadcumb" :key="i">
      <UButton
        variant="ghost"
        color="link"
        :disabled="item?.disabled"
        class="disabled:text-gray-500 dark:bg-transparent dark:text-white p-0"
        @click="handleHref(item && item.href ? item.href : '')"
      >
        {{ item?.text }}
      </UButton>
      <span v-if="i !== breadcumb.length - 1"> /&nbsp;</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreadcumbStore } from '@/stores/breadcumb'

const { stateLink } = storeToRefs(useBreadcumbStore())
const router = useRouter()
const route = useRoute()

const breadcumb = ref<
  ({ href: string; text: string; disabled: boolean } | undefined)[]
>([])

const handleHref = (handleHref: string) => {
  stateLink.value = true
  router.push(handleHref)
}

watch(
  () => route.fullPath,
  (newValue) => {
    console.log(newValue, 'inivalue')
    const routeMap = newValue.split('/admin/dashboard').filter(Boolean)
    const newBreadcumb = routeMap.map((item) => {
      const Capitalized = item.slice(0, 1).toUpperCase()
      return {
        href: '',
        text: item
          .replace(/^\w/gm, Capitalized)
          .split('/')
          .map((items) => {
            console.log(items, 'iniitem')
            const Capitalized2 = items.slice(0, 1).toUpperCase()
            return items.replace(/^\w/gm, Capitalized2)
          })
          .filter(Boolean)
          .join(' / '),
        disabled: true,
      }
    })
    console.log(newBreadcumb, 'inbread')
    breadcumb.value = [
      {
        href: '/admin/dashboard',
        text: 'Dashboard',
        disabled: false,
      },
      ...newBreadcumb,
    ].filter((item) => item)
  },
  {
    deep: true,
    immediate: true,
  }
)
</script>

<style lang="scss" scoped></style>
