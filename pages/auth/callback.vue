<template>
  <div></div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: false,
})
onMounted(() => {
  setTimeout(() => {
    window.location.href = '/admin/dashboard'
  }, 300)
})
</script>

<style scoped></style>
