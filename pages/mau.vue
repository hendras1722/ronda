<template>
  <div>
    <canvas
      id="myCanvas"
      width="400"
      height="400"
      @mouseup="handleMouseUp"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
    ></canvas>
    <button id="myButton" @click="handleAddPersegi">Tambah Persegi</button>
  </div>
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement>()
const ctx = ref()

nextTick(() => {
  canvas.value = document.getElementById('myCanvas') as HTMLCanvasElement
  ctx.value = canvas.value.getContext('2d')
})

const squares = ref<any[]>([])
const selectedSquare = ref()
const offsetX = ref()
const offsetY = ref()

// Fungsi untuk menggambar objek persegi
function drawSquare(square) {
  if (!ctx.value) return
  ctx.value.fillStyle = square.color
  ctx.value.fillRect(square.x, square.y, 50, 50)

  for (const square of squares.value) {
    if (square.isResizing) {
      const handleX = square.x + square.width
      const handleY = square.y + square.height

      ctx.value.fillStyle = '#000'
      ctx.value.fillRect(
        handleX - square.resizeHandleSize / 2,
        handleY - square.resizeHandleSize / 2,
        square.resizeHandleSize,
        square.resizeHandleSize
      )
    }
  }
}

function isMouseInsideSquare(square, x, y) {
  return x > square.x && x < square.x + 50 && y > square.y && y < square.y + 50
}

// Fungsi untuk mengecek apakah objek persegi berada di dalam elemen canvas
function isSquareInsideCanvas(square) {
  if (!canvas.value) return
  return (
    square.x >= 0 &&
    square.x + 50 <= canvas.value.width &&
    square.y >= 0 &&
    square.y + 50 <= canvas.value.height
  )
}

// Fungsi untuk mengecek apakah objek persegi tumpuk dengan objek persegi lain
function isSquareOverlapping(newSquare, otherSquare) {
  return (
    newSquare.x < otherSquare.x + 50 &&
    newSquare.x + 50 > otherSquare.x &&
    newSquare.y < otherSquare.y + 50 &&
    newSquare.y + 50 > otherSquare.y
  )
}

function handleMouseDown(e) {
  if (!canvas.value) return
  const mouseX = e.clientX - canvas.value.getBoundingClientRect().left
  const mouseY = e.clientY - canvas.value.getBoundingClientRect().top

  selectedSquare.value =
    squares.value &&
    squares.value.find((square) => isMouseInsideSquare(square, mouseX, mouseY))

  if (selectedSquare.value) {
    offsetX.value = mouseX - selectedSquare.value.x
    offsetY.value = mouseY - selectedSquare.value.y
  }
}

function handleMouseUp() {
  // Menangani peristiwa ketika mouse dilepas

  selectedSquare.value = null
}

function handleMouseMove(e) {
  // Menangani peristiwa ketika mouse bergerak
  if (!canvas.value) return
  if (selectedSquare.value) {
    const mouseX = e.clientX - canvas.value.getBoundingClientRect().left
    const mouseY = e.clientY - canvas.value.getBoundingClientRect().top
    selectedSquare.value.x = mouseX - offsetX.value
    selectedSquare.value.y = mouseY - offsetY.value

    // Memastikan objek persegi tetap di dalam elemen canvas
    if (selectedSquare.value.x < 0) {
      selectedSquare.value.x = 0
    }
    if (selectedSquare.value.x + 50 > canvas.value.width) {
      selectedSquare.value.x = canvas.value.width - 50
    }
    if (selectedSquare.value.y < 0) {
      selectedSquare.value.y = 0
    }
    if (selectedSquare.value.y + 50 > canvas.value.height) {
      selectedSquare.value.y = canvas.value.height - 50
    }

    // Memeriksa tumpukan dengan objek persegi lain
    for (const square of squares.value) {
      if (
        square !== selectedSquare.value &&
        isSquareOverlapping(selectedSquare.value, square)
      ) {
        // Tentukan perpindahan untuk menghindari tumpukan
        if (selectedSquare.value.x < square.x) {
          selectedSquare.value.x = square.x - 50
        } else {
          selectedSquare.value.x = square.x + 50
        }
        if (selectedSquare.value.y < square.y) {
          selectedSquare.value.y = square.y - 50
        } else {
          selectedSquare.value.y = square.y + 50
        }
      }
    }

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
    for (const square of squares.value) {
      drawSquare(square)
    }
  }
}

// Menangani peristiwa ketika tombol "Tambah Persegi" diklik

function handleAddPersegi() {
  if (!canvas.value) return
  const randomX = Math.random() * (canvas.value.width - 50)
  const randomY = Math.random() * (canvas.value.height - 50)
  const randomColor = getRandomColor()
  const newSquare = {
    x: randomX,
    y: randomY,
    color: randomColor,
    isResizing: true,
  }

  let canAdd = true
  for (const square of squares.value) {
    if (isSquareOverlapping(newSquare, square)) {
      canAdd = false
      break
    }
  }

  if (canAdd) {
    squares.value.push(newSquare)
    drawSquare(newSquare)
  }
}
// const myButton = document.getElementById("myButton");
// myButton.addEventListener("click", () => {

// });

// Fungsi untuk menghasilkan warna acak
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}
</script>

<style lang="scss" scoped></style>
