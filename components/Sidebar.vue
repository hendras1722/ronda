<template>
  <div>
    <div
      class="md:block hidden min-h-screen w-52 md:static absolute md:z-0 z-50 duration-100 dark:bg-gray-900"
      id="sidebar"
    >
      <div>
        <div class="flex justify-center items-center my-3 h-14 overflow-hidden">
          <div>
            <NuxtLink to="/">
              <img class="w-16" src="/msa_logo.jpeg" alt="Logo MSA" />
            </NuxtLink>
          </div>
        </div>
        <div class="overflow-auto max-h-[calc(100vh-80px)] pb-3">
          <div
            v-for="(itemMenu, i) in items"
            :key="`sidebar-${itemMenu.label} + ${i}`"
            class="px-3"
          >
            <div
              v-if="itemMenu.title"
              class="pl-3 pb-3 text-sm font-bold md:block last:mt-3"
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
                  <span class="md:block">
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
                ref="accordion"
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
                      class="truncate md:block"
                      :class="[
                        itemMenu.children.filter(
                          (item) => item.to === route.fullPath
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
                  <div
                    class="bg-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:text-white"
                  >
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
                            <span class="md:block ml-1">
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
    <!-- mobile -->
    <div
      class="md:hidden flex w-full min-h-screen fixed z-50 backdrop-brightness-50"
      id="sidebar2"
    >
      <div class="w-52 md:static md:z-0 bg-white duration-100 dark:bg-gray-900">
        <div class="py-3">
          <div class="flex justify-center items-center h-14 overflow-hidden">
            <div>
              <NuxtLink to="/">
                <img class="w-16" src="/msa_logo.jpeg" alt="Logo MSA" />
              </NuxtLink>
            </div>
          </div>
          <div class="overflow-auto max-h-[calc(100vh-80px)] pb-3">
            <div
              v-for="(itemMenu, i) in items"
              :key="`sidebar-${itemMenu.label} + ${i}`"
              class="px-3"
            >
              <div
                v-if="itemMenu.title"
                class="pl-3 pb-3 text-sm font-bold md:block last:mt-3"
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
                    <span class="md:block whitespace-normal">
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
                  ref="accordion"
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
                        class="truncate md:block"
                        :class="[
                          itemMenu.children.filter(
                            (item) => item.to === route.fullPath
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
                    <div
                      class="bg-gray-300 p-3 rounded-lg dark:bg-gray-700 dark:text-white"
                    >
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
                              <span class="md:block ml-1">
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

const { stateLink } = storeToRefs(useBreadcumbStore())

const items = ref([
  {
    title: 'Data Management',
  },
  {
    label: 'Dashboard',
    icon: 'i-ion-pie-chart',
    slot: 'dashboard',
    to: '/',
    children: [],
  },
  {
    label: 'Tables',
    icon: '',
    slot: 'tables',
    closeOthers: false,
    children: [
      {
        label: 'Fruit',
        icon: 'i-ion-fast-food',
        children: [],
        slot: 'tables',
        to: '/tables/fruit',
      },
      {
        label: 'Person',
        icon: 'i-ion-person-stalker',
        children: [],
        slot: 'tables',
        to: '/tables/person',
      },
    ],
  },
  {
    label: 'Table2',
    icon: '',
    slot: 'table2',
    closeOthers: false,
    children: [
      {
        label: 'Fruit',
        icon: 'i-ion-fast-food',
        children: [],
        slot: 'table2',
        to: '/fruit1',
      },
      {
        label: 'Person',
        icon: 'i-ion-person-stalker',
        children: [],
        slot: 'table2',
        to: '/person1',
      },
    ],
  },
  {
    label: 'Table3',
    icon: '',
    slot: 'table3',
    closeOthers: false,
    children: [
      {
        label: 'Fruit',
        icon: 'i-ion-fast-food',
        children: [],
        slot: 'table3',
        to: '/fruit2',
      },
      {
        label: 'Person',
        icon: 'i-ion-person-stalker',
        children: [],
        slot: 'table3',
        to: '/person2',
      },
    ],
  },
  {
    label: 'Form',
    icon: 'i-ion-file-tray-full',
    slot: 'form',
    to: '/form',
    children: [],
  },
  {
    label: 'Lazy Image',
    icon: 'i-ion-image',
    slot: 'lazy_image',
    to: '/lazy-image',
    children: [],
  },

  {
    label: 'Lazy scroll',
    icon: 'i-ion-ios-bug',
    slot: 'lazy_scroll',
    to: '/lazy-scroll',
    children: [],
  },
  {
    title: 'Settings',
  },
  {
    label: 'Profile',
    icon: 'i-ion-android-contact',
    slot: 'profile',
    to: '/',
    children: [],
  },
])
const accordion = templateRef('acordion', [])

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
  if (!accordion.value || accordion.value.length < 1) return
  accordion.value.forEach((element) => {
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
  if (!accordion.value || accordion.value.length < 1) return
  const itemSidebar = items.value.filter(
    (item) => item.children && item.children.length > 0
  )
  const getIndexItemSidebar = itemSidebar.findIndex((item) => item.slot === e)
  itemSidebar.forEach((_, index) => {
    if (index !== getIndexItemSidebar) {
      const buttonRefsVariable: any = accordion.value[index]
      buttonRefsVariable.buttonRefs[0].close()
    }
  })
}

function handleSidebar() {
  const body = document.getElementById('sidebar')
  const body2 = document.getElementById('sidebar2')
  if (body2 && smallerMd.value) {
    if (!body2.style.transform || body2.style.transform === 'translateX(0%)') {
      body2.style.transform = 'translateX(-100%)'
      body2.classList.remove('w-52')
      body2.classList.add('w-0')
      return
    }
    body2.style.transform = 'translateX(0%)'
    body2.classList.add('w-52')
    body2.classList.remove('w-0')
    return
  }
  if (body) {
    if (!body.style.transform || body.style.transform === 'translateX(0%)') {
      body.style.transform = 'translateX(-100%)'
      body.classList.remove('w-52')
      body.classList.add('w-0')
      return
    }
    body.style.transform = 'translateX(0%)'
    body.classList.add('w-52')
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
          body2.classList.remove('w-52')
          body2.classList.add('w-0')
          return
        }
        body2.style.transform = 'translateX(0%)'
        body2.classList.add('w-52')
        body2.classList.remove('w-0')
        return
      }
      if (body) {
        if (
          !body.style.transform ||
          body.style.transform === 'translateX(0%)'
        ) {
          body.style.transform = 'translateX(-100%)'
          body.classList.remove('w-52')
          body.classList.add('w-0')
          return
        }
        body.style.transform = 'translateX(0%)'
        body.classList.add('w-52')
        body.classList.remove('w-0')
      }
    }, 300)
  }
}
</script>
