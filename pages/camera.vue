<template>
  <div>
    <div class="font-bold text-2xl">Camera Oi Oi Oi</div>
    <UButton @click="handleOpen" class="mt-3 dark:text-white overflow-hidden"
      >Klik Disini</UButton
    >
    <div v-if="imageSrc">
      result:
      <img :src="imageSrc" />
    </div>
    <UModal
      v-model="isOpen"
      fullscreen
      class="p-0 m-0"
      :ui="{
        container:
          'relative flex min-h-screen items-end sm:items-center justify-center text-center',
        base: 'fixed text-left rtl:text-right overflow-hidden w-full flex flex-col',
      }"
    >
      <div class="relative cursor-pointer z-10" v-if="!loadingVideos">
        <div
          @click="stopCameraStream()"
          class="absolute top-0 right-0 mt-3 mr-3 text-2xl"
        >
          <UIcon name="i-ion-close-circle"></UIcon>
        </div>
      </div>
      <CameraJebreet
        ref="camera"
        facingModeCamera="user"
        :preview="true"
        :size="100"
        frame
      >
        <template #frame>
          <div class="w-56 h-56 bg-white"></div>
        </template>
      </CameraJebreet>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import CameraJebreet from 'vue3-camera-jebreet'
import { useWindowSize } from '@vueuse/core'

const isOpen = ref(false)
const loadingVideos = ref(false)
const imageSrc = ref('')
const facingMode = ref(0)
const camera = ref()

// const { width } = useWindowSize()
// /*@@@@@@@
//   Init Camera
// @@@@@@*/
// async function cameraStream() {
//   loadingVideos.value = true
//   const ratioCalc: string[] = aspectRatio(
//     window.innerWidth,
//     window.innerHeight
//   ).split(':')

//   const userAgentData = (navigator as any).userAgentData

//   let aspectRatioCalc = undefined
//   if (userAgentData && userAgentData.mobile) {
//     aspectRatioCalc = Number(ratioCalc[0]) / Number(ratioCalc[1])
//   } else {
//     if (navigator.maxTouchPoints === 1) {
//       aspectRatioCalc = Number(ratioCalc[0]) / Number(ratioCalc[1])
//     } else if (
//       /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/.test(
//         navigator.userAgent
//       )
//     ) {
//       aspectRatioCalc = Number(ratioCalc[1]) / Number(ratioCalc[0])
//     }
//   }

//   // function isMobile() {
//   //   try {
//   //     document.createEvent('TouchEvent')
//   //     return true
//   //   } catch (e) {
//   //     return false
//   //   }
//   // }
//   // if (isMobile()) {
//   //   aspectRatioCalc = Number(ratioCalc[1]) / Number(ratioCalc[0])
//   // }

//   const arr: any = []
//   const mediaDevices = navigator.mediaDevices as any
//   await mediaDevices
//     .enumerateDevices()
//     .then((devices: any) => {
//       devices.forEach((device: any) => {
//         if (device.kind === 'video') {
//           device.kind = 'videoinput'
//         }

//         if (device.kind === 'videoinput') {
//           // videoInCount++
//           arr.push(device.deviceId)
//         }
//       })

//       // resolve(videoInCount)
//     })
//     .catch((err: Error) => {
//       console.error(`${err.name} : ${err.message}`)
//     })
//   const constraints = {
//     audio: false,
//     video: {
//       facingMode: facingMode.value === 0 ? 'environment' : 'user',
//       aspectRatio: aspectRatioCalc,
//       deviceId: { exact: arr[arr.length - 1] },
//     },
//   }

//   const res = await navigator.mediaDevices
//     .getUserMedia(constraints)
//     .then((stream) => {
//       const videos = document.getElementById('video') as HTMLVideoElement
//       if (!videos) return
//       videos.width = window.innerWidth
//       videos.height = window.innerHeight
//       setTimeout(() => {
//         videos.autoplay = true
//         videos.srcObject = stream
//         loadingVideos.value = false
//       }, 1000)
//       return true
//     })
//     .catch((error) => {
//       alert("May the browser didn't support or there is some errors.")
//       return false
//     })
//   return res
// }

// /**
//  *
//  * @Calculate aspect ratio and GCD
//  *
//  */
// function gcd(a: number, b: number): number {
//   return b ? gcd(b, a % b) : a
// }
// function aspectRatio(width: number, height: number): string {
//   const divisor = gcd(width, height)

//   return `${width / divisor}:${height / divisor}`
// }

async function handleOpen() {
  imageSrc.value = ''
  isOpen.value = true
  // cameraStream()
}
// /**
//  *
//  * Stop Camera
//  *
//  */

async function stopCameraStream(e?: string) {
  await camera.value.stop()
  isOpen.value = false
}

// function handleCapture() {
//   if (loadingVideos.value) return

//   const video = document.getElementById('video') as HTMLVideoElement
//   // Create a canvas element and draw the video frame onto it
//   const canvas = document.createElement('canvas')
//   const ctx = canvas.getContext('2d')
//   canvas.width = window.innerWidth
//   canvas.height = window.innerHeight
//   if (!ctx) return
//   ctx.imageSmoothingEnabled = false
//   ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

//   // Convert the canvas image data to a data URL and create an image element
//   imageSrc.value = canvas.toDataURL('image/png', 1.0)
//   stopCameraStream('capture')
// }

// function handleSync() {
//   const sync = document.getElementById('icon_sync')
//   sync?.classList.add('sync_camera')
//   setTimeout(() => {
//     sync?.classList.remove('sync_camera')
//   }, 1000)
//   facingMode.value += 1
//   if (facingMode.value % 2 === 0) {
//     facingMode.value = 0
//   }
//   setTimeout(() => {
//     stopCameraStream('change')
//   }, 300)
//   setTimeout(() => {
//     cameraStream()
//   }, 500)
// }

// watch(width, () => {
//   stopCameraStream('resize')

//   setTimeout(() => {
//     cameraStream()
//   }, 300)
// })
</script>

<style scoped lang="scss">
// video {
// height: 100vh;
// }

.sync_camera {
  transform: rotate(360deg);
  transition-duration: 150ms;
}
</style>
