<template>
  {{ loadingMun }}
  <div v-show="loadingMun" class="loading-overlay">
    <div class="loading-container">
      <img class="loading-item" src="/msa_logo.jpeg" alt="Icon MSA" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loadingPages, loading } = storeToRefs(useLoading())
const loadingMun = computed(() => loadingPages.value || loading.value)
</script>

<style lang="scss" scoped></style>
