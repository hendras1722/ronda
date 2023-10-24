<template>
  <div class="grid gap-3">
    <div class="w-52">
      Native JS
      <div
        :class="`blur-load bg-no-repeat bg-[url(/loading.gif)] bg-center bg-contain`"
      >
        <img
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          loading="lazy"
        />
      </div>
    </div>
    <div class="w-52">
      using vueuse Image
      <div>
        <span v-if="isLoading">
          <img src="/loading.gif" />
        </span>
        <img v-else :src="avatarUrl" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useImage } from '@vueuse/core'

const avatarUrl = 'https://avatars.githubusercontent.com/u/739984?v=4'
const { isLoading } = useImage({ src: avatarUrl })

nextTick(() => {
  const blurDivs = document.querySelectorAll('.blur-load')
  for (const div of blurDivs) {
    const img = document.querySelector('img')

    function loaded() {
      div.classList.add('loaded')
      div.classList.remove('bg-[url(/loading.gif)]')
    }
    if (img?.complete) {
      loaded()
    } else {
      img?.addEventListener('load', loaded)
    }
  }
})
</script>

<style scoped lang="scss">
.blur-load.loaded > img {
  opacity: 1;
}
.blur-load > img {
  opacity: 0;
}
</style>
