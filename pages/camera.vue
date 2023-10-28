<template>
  <div>
    <div class="font-bold text-2xl">Camera Oi Oi Oi</div>
    <UButton @click="handleOpen" class="mt-3 dark:text-white"
      >Klik Disini</UButton
    >
    <UModal
      v-model="isOpen"
      fullscreen
      class="p-0 m-0"
      :ui="{
        container:
          'flex min-h-screen items-end sm:items-center justify-center text-center',
        base: 'fixed text-left rtl:text-right overflow-hidden w-full flex flex-col',
      }"
    >
      <div class="relative cursor-pointer z-10" v-if="!loadingVideos">
        <div
          @click="stopCameraStream"
          class="absolute top-0 right-0 mt-3 mr-3 text-2xl"
        >
          <UIcon name="i-ion-close-circle"></UIcon>
        </div>
      </div>
      <div class="w-full">
        <video id="video" class="h-full" />
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const isOpen = ref(false)
const loadingVideos = ref(false)

async function cameraStream() {
  loadingVideos.value = true
  const ratioCalc: string[] = aspectRatio(
    window.innerWidth,
    window.innerHeight
  ).split(':')

  // const userAgentData = (navigator as any).userAgentData

  let aspectRatioCalc = undefined
  // if (userAgentData && userAgentData.mobile) {
  //   alert('mobileuseragent')
  //   aspectRatioCalc = Number(ratioCalc[1]) / Number(ratioCalc[0])
  // } else {
  //   if (navigator.maxTouchPoints === 1) {
  //     aspectRatioCalc = Number(ratioCalc[0]) / Number(ratioCalc[1])
  //   } else if (
  //     /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(
  //       navigator.userAgent
  //     )
  //   ) {
  //     alert('regex')
  //     aspectRatioCalc = Number(ratioCalc[1]) / Number(ratioCalc[0])
  //   }
  // }

  function isMobile() {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  }
  if (isMobile()) {
    aspectRatioCalc = Number(ratioCalc[1]) / Number(ratioCalc[0])
  }

  const arr: any = []
  const mediaDevices = navigator.mediaDevices as any
  await mediaDevices
    .enumerateDevices()
    .then((devices: any) => {
      devices.forEach((device: any) => {
        if (device.kind === 'video') {
          device.kind = 'videoinput'
        }

        if (device.kind === 'videoinput') {
          // videoInCount++
          arr.push(device.deviceId)
        }
      })

      // resolve(videoInCount)
    })
    .catch((err: Error) => {
      console.error(`${err.name} : ${err.message}`)
    })

  const constraints = {
    audio: false,
    video: {
      facingMode: 'environment',
      aspectRatio: aspectRatioCalc,
      deviceId: { exact: arr[arr.length - 1] },
    },
  }

  const res = await navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const videos = document.getElementById('video') as HTMLVideoElement
      if (!videos) return
      videos.width = window.innerWidth
      videos.height = window.innerHeight
      setTimeout(() => {
        videos.autoplay = true
        videos.srcObject = stream
        loadingVideos.value = false
      }, 1000)
      return true
    })
    .catch((error) => {
      alert("May the browser didn't support or there is some errors.")
      return false
    })
  return res
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}
function aspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height)

  return `${width / divisor}:${height / divisor}`
}

async function handleOpen() {
  isOpen.value = true
  cameraStream()
}

function stopCameraStream() {
  const videos = document.getElementById('video') as HTMLVideoElement
  if (!videos) return
  const tracks = (videos?.srcObject as any)?.getTracks()

  videos.src = ''
  tracks.forEach((track: any) => {
    track.stop()
  })

  isOpen.value = false
}
</script>

<style scoped lang="scss">
// video {
// height: 100vh;
// }
</style>
