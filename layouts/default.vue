<template>
  <!-- <div class="grid grid-rows-3 grid-flow-col gap-4">
    <div class="row-span-2">
      <Sidebar />
    </div>
    <div class="col-span-2">
      <Navbar />
    </div>
  </div> -->
  <div class="flex">
    <Sidebar />
    <div class="w-full">
      <Navbar />
      <div class="p-5">
        <div class="grid grid-cols-12 grid-rows-1 gap-4">
          <div class="col-span-12">
            <UContainer
              class="mt-4 px-3 py-5 max-w-full bg-white shadow-md rounded-lg dark:bg-gray-900 dark:text-white dark:border dark:border-white"
            >
              <slot />
            </UContainer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
body {
  @apply bg-gray-50 dark:bg-gray-900;
}
</style>
