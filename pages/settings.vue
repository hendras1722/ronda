<template>
  <div>
    <NuxtErrorBoundary>
      <template #error="{ error }">
        <h2>{{ error }}</h2>
        <UButton @click="clearError(error)" class="mt-6">
          <span aria-hidden="true">&larr;</span>
          &nbsp; Clear
        </UButton>
      </template>
      <NuxtPage />
    </NuxtErrorBoundary>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'settings',
})
</script>

<style lang="scss" scoped></style>
