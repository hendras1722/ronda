<template>
  <div class="min-h-screen w-52 md:static duration-100" id="sidebar">
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
          v-for="(itemMenu, index) in items"
          :key="`sidebar-${itemMenu.label} + ${index}`"
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
                class="dark:border-gray-700 text-black w-full bg-white rounded-2xl shadow-lg"
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
            >
              <template #default="{ open }">
                <UButton
                  :icon="itemMenu.icon"
                  class="text-black w-full bg-white rounded-2xl shadow-lg"
                  :ui="{
                    rounded: 'rounded-none',
                    padding: { sm: 'p-3' },
                  }"
                >
                  <span class="truncate md:block">
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
                <div class="bg-gray-300 p-3 rounded-lg">
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
                        class="dark:border-gray-700 text-black my-3 bg-white rounded-2xl w-full shadow-lg"
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
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerMd = breakpoints.smaller('md')
const router = useRouter()

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
        to: '/fruit',
      },
      {
        label: 'Person',
        icon: 'i-ion-person-stalker',
        children: [],
        slot: 'tables',
        to: '/person',
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

const handleAccordion = (href: string) => {
  handlePushRouter(href)
}
const handlePushRouter = (href: string) => {
  const body = document.getElementById('sidebar')
  router.push(href)
  if (smallerMd.value) {
    setTimeout(() => {
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
