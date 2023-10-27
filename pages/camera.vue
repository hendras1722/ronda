<template>
  <div>
    <UButton @click="handleOpen">OPenModal</UButton>
    <UModal v-model="isOpen" fullscreen>
      <video id="video" class="w-full h-full" />
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const isOpen = ref(false)
function handleOpen() {
  isOpen.value = true
  cameraStream()
}
// const videoStream = (canvas, stream) => {
//   const video = document.getElementById('video')

//   video.addEventListener('loadedmetadata', () => {
//     // const context = canvas.getContext('2d')
//     // const drawImage = () => {
//     //   context.drawImage(video, 0, 0)
//     //   window.requestAnimationFrame(drawImage)
//     // }
//     // drawImage()
//   })

//   video.autoplay = true
//   video.srcObject = stream
// }
function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a
}
function aspectRatio(width: number, height: number): string {
  const divisor = gcd(width, height)

  return `${width / divisor}:${height / divisor}`
}

const cameraStream = async () => {
  const ratioCalc: string[] = aspectRatio(
    window.innerWidth,
    window.innerHeight
  ).split(':')
  let aspectRatioCalc = Number(ratioCalc[0]) / Number(ratioCalc[1])
  const constraints = {
    video: {
      facingMode: 'environment',
      width: 1280,
      height: 720,
      aspectRatio: aspectRatioCalc,
    },
  }
  const res = await navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const video = document.getElementById('video') as HTMLVideoElement
      if (!video) return
      video.autoplay = true
      video.srcObject = stream
      return true
    })
    .catch((error) => {
      alert("May the browser didn't support or there is some errors.")
      return false
    })
  return res
}
</script>
