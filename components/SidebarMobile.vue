<template>
  <div>
    <!-- mobile -->
    <div
      class="sm:hidden flex w-full min-h-screen fixed duration-100 z-50 backdrop-brightness-50"
      id="sidebar2"
    >
      <div class="w-96 sm:static sm:z-0 bg-white dark:bg-gray-900">
        <div class="py-3">
          <div class="flex justify-center items-center h-14 overflow-hidden">
            <div>
              <NuxtLink to="/">
                <img class="w-16" src="/msa_logo.jpeg" alt="Logo MSA" />
              </NuxtLink>
            </div>
          </div>
          <div class="overflow-auto max-h-[calc(100vh-100px)] pb-3">
            <div
              v-for="(itemMenu, i) in items"
              :key="`sidebar-${itemMenu.label} + ${i}`"
              class="px-3"
            >
              <div
                v-if="itemMenu.title"
                class="pl-3 pb-3 text-sm font-bold sm:block last:mt-3"
              >
                {{ itemMenu.title }}
              </div>
              <div
                class="p-3 rounded-xl"
                v-if="itemMenu.children && itemMenu.children?.length < 1"
              >
                <NuxtLink :to="itemMenu.to" v-slot="{ href, isActive }" custom>
                  <UButton
                    class="dark:bg-gray-800 dark:text-white text-black w-full bg-white rounded-2xl shadow-lg"
                    :ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
                    @click="handleAccordion(href)"
                    :class="[isActive && 'text-black bg-gray-200 ']"
                  >
                    <UIcon
                      :name="itemMenu.icon"
                      :class="[isActive && 'text-blue-500 text-md']"
                      class="text-md"
                    />
                    <span class="sm:block whitespace-normal">
                      {{ itemMenu.label }}
                    </span>
                  </UButton>
                </NuxtLink>
              </div>
              <div
                v-if="itemMenu.children && itemMenu.children?.length > 0"
                class="p-3 rounded-xl"
              >
                <UAccordion
                  :items="[itemMenu]"
                  :ui="{ wrapper: 'flex flex-col w-full text-black' }"
                  multiple
                  :defaultOpen="showOpenAccordion(itemMenu)"
                  ref="accordion2"
                >
                  <template #default="{ open, item, index }">
                    <UButton
                      :icon="itemMenu.icon"
                      class="dark:bg-gray-800 dark:text-white text-black w-full bg-white rounded-2xl shadow-lg"
                      :ui="{
                        rounded: 'rounded-none',
                        padding: { sm: 'p-3' },
                      }"
                      @click="handleAccordionChildren(item.slot)"
                    >
                      <span
                        class="truncate sm:block"
                        :class="[
                          itemMenu.children.filter(
                            (item:any) => item.to === route.fullPath
                          ).length > 0 && 'text-blue-500 font-bold',
                        ]"
                      >
                        {{ itemMenu.label }}
                      </span>
                      <template #trailing>
                        <UIcon
                          name="i-heroicons-chevron-right-20-solid"
                          class="w-5 h-5 ms-auto transform transition-transform duration-200"
                          :class="[open && 'rotate-90']"
                        />
                      </template>
                    </UButton>
                  </template>
                  <template #[itemMenu.slot]="{ item }">
                    <div>
                      <div
                        class="flex justify-end"
                        v-for="(itemChildren, i) in item.children"
                        :key="i"
                      >
                        <NuxtLink
                          :to="itemChildren.to"
                          v-slot="{ href, isActive }"
                          custom
                        >
                          <UButton
                            color="royal-blue"
                            variant="ghost"
                            class="dark:bg-gray-800 dark:text-white dark:border-gray-700 text-black my-3 bg-white rounded-2xl w-full shadow-lg"
                            :ui="{
                              rounded: 'rounded-none',
                              padding: { sm: 'p-3 ' },
                            }"
                            :class="[isActive && 'text-black bg-gray-200 ']"
                            @click="handlePushRouter(href)"
                          >
                            <span class="pl-3 flex items-center">
                              <UIcon
                                :name="itemChildren.icon"
                                :class="[isActive && 'text-blue-500 text-md ']"
                                class="text-md"
                              />
                              <span class="sm:block ml-1 whitespace-normal">
                                {{ itemChildren.label }}
                              </span>
                            </span>
                          </UButton>
                        </NuxtLink>
                      </div>
                    </div>
                  </template>
                </UAccordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="w-screen" @click="handleSidebar"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints, templateRef } from '@vueuse/core'
import { useBreadcumbStore } from '@/stores/breadcumb'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerMd = breakpoints.smaller('md')
const router = useRouter()
const route = useRoute()
const appConfig = useAppConfig()

const { stateLink } = storeToRefs(useBreadcumbStore())

const items = ref<any>(appConfig.menu)
const accordion2 = templateRef('acordion2', [])

watch(
  () => stateLink.value,
  (newValue) => {
    if (newValue) {
      handleAccordionChildren(route.fullPath)
    }
  }
)

const handleAccordion = (href: string) => {
  handlePushRouter(href)
  if (!accordion2.value || accordion2.value.length < 1) return
  accordion2.value.forEach((element) => {
    const buttonRefsElement: { buttonRefs: { close: Function }[] } = element
    buttonRefsElement.buttonRefs.forEach((buttonrefs) => {
      buttonrefs.close()
    })
  })
}

const showOpenAccordion = (e: { children: { to: string }[] }) => {
  return e.children.filter((item) => item.to === route.fullPath).length > 0
}

const handleAccordionChildren = (e: string) => {
  stateLink.value = false
  if (!accordion2.value || accordion2.value.length < 1) return
  const itemSidebar = items.value.filter(
    (item: any) => item.children && item.children.length > 0
  )
  const getIndexItemSidebar = itemSidebar.findIndex(
    (item: any) => item.slot === e
  )
  itemSidebar.forEach((_: any, index: number) => {
    if (index !== getIndexItemSidebar) {
      const buttonRefsVariable1: any = accordion2.value[index]
      buttonRefsVariable1.buttonRefs[0].close()
    }
  })
}

function handleSidebar() {
  const body = document.getElementById('sidebar')
  const body2 = document.getElementById('sidebar2')
  if (body2 && smallerMd.value) {
    if (!body2.style.transform || body2.style.transform === 'translateX(0%)') {
      body2.style.transform = 'translateX(-100%)'
      body2.classList.remove('w-96')
      body2.classList.add('w-0')
      return
    }
    body2.style.transform = 'translateX(0%)'
    body2.classList.add('w-96')
    body2.classList.remove('w-0')
    return
  }
  if (body) {
    if (!body.style.transform || body.style.transform === 'translateX(0%)') {
      body.style.transform = 'translateX(-100%)'
      body.classList.remove('w-96')
      body.classList.add('w-0')
      return
    }
    body.style.transform = 'translateX(0%)'
    body.classList.add('w-96')
    body.classList.remove('w-0')
  }
}

const handlePushRouter = (href: string) => {
  const body = document.getElementById('sidebar')
  const body2 = document.getElementById('sidebar2')
  router.push(href)
  if (smallerMd.value) {
    setTimeout(() => {
      if (body2 && smallerMd.value) {
        if (
          !body2.style.transform ||
          body2.style.transform === 'translateX(0%)'
        ) {
          body2.style.transform = 'translateX(-100%)'
          body2.classList.remove('w-96')
          body2.classList.add('w-0')
          return
        }
        body2.style.transform = 'translateX(0%)'
        body2.classList.add('w-96')
        body2.classList.remove('w-0')
        return
      }
      if (body) {
        if (
          !body.style.transform ||
          body.style.transform === 'translateX(0%)'
        ) {
          body.style.transform = 'translateX(-100%)'
          body.classList.remove('w-96')
          body.classList.add('w-0')
          return
        }
        body.style.transform = 'translateX(0%)'
        body.classList.add('w-96')
        body.classList.remove('w-0')
      }
    }, 300)
  }
}
</script>
