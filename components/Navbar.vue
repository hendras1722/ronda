<template>
  <div>
    <nav :class="appConfig.Navbar.container">
      <div :class="appConfig.Navbar.childContainer">
        <div class="flex items-center gap-2">
          <div class="p-1 flex items-center rounded-xl">
            <UButton @click="openSidebar">
              <UIcon name="i-ion-reorder-four-outline text-lg  dark:text-white" />
            </UButton>
            <ClientOnly>
              <UButton :icon="isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
                " aria-label="Theme" @click="isDark = !isDark" class="dark:text-white" />

              <template #fallback>
                <div class="w-8 h-8" />
              </template>
            </ClientOnly>
          </div>
        </div>
        <UDropdown :items="itemsDropdown" :popper="{ placement: 'bottom-start' }"
          :ui="{ item: { disabled: 'cursor-text select-text' } }">
          <template #profile="{ item }">
            <div class="text-left">
              <p>Signed in as</p>
              <div class="flex items-center gap-3 mt-3">
                <p class="truncate font-medium text-gray-900 dark:text-white w-[160px]">
                  {{ item.label }}
                </p>
              </div>
            </div>
          </template>
          <template #kompleks="{ item }">
            <div class="text-left w-full">
              <p>{{ item.label }}</p>
              <UButton v-for="(data, i) in complex" :key="i" class="w-full my-3 last:mb-0">
                {{ data?.complex?.house_complex }}
              </UButton>
            </div>
          </template>

          <template #sign_out>
            <UButton @click="logout" class="w-full" variant="soft" color="secondary">
              keluar
            </UButton>
          </template>
          <UButton>
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/008/442/086/small/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
              class="w-8 h-8 rounded-full" />
          </UButton>
        </UDropdown>
      </div>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerMd = breakpoints.smaller('md')
const colorMode = useColorMode()
const appConfig = useAppConfig()

const user = useGetuser()
const router = useRouter()

const name = computed(() => {
  return (user.user && user.user.data[0]?.name) || ''
})
const complex = computed(() => {
  return user.user.data
})

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})

const openSidebar = () => {
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
const itemsDropdown = ref([
  [
    {
      label: name.value || '',
      slot: 'profile',
      disabled: true,
    },
  ],
  [
    {
      label: 'Kompleks',
      slot: 'kompleks',
      disabled: true,
    },
  ],
  [
    {
      label: 'Pengaturan',
      slot: 'settings',
      click: () => handlePengaturan(),
    },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-left-on-rectangle',
      slot: 'sign_out',
      disabled: true,
    },
  ],
])

function handlePengaturan() {
  router.push('/settings')
}

async function logout() {
  let { error } = await supabase.auth.signOut()
  if (!error) {
    setTimeout(() => {
      window.location.href = '/login'
    }, 300)
  }
}
defineExpose({
  openSidebar,
})
</script>
