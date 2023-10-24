<template>
  <div v-if="loadingPages" class="h-screen flex justify-center items-center">
    <div>
      <img src="/msa_logo.jpeg" class="h-28" />
      <div class="text-center mt-5">Loading...</div>
    </div>
  </div>
  <div v-show="loading" class="loading-overlay">
    <div class="loading-container">
      <img class="loading-item" src="/msa_logo.jpeg" alt="Icon MSA" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadingPages, loading } = storeToRefs(useLoading())
definePageMeta({
  layout: false,
})
</script>

<style lang="scss" scoped></style>
