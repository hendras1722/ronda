<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <!-- Content -->
      <UForm :schema="schema" :state="state">
        <UFormGroup
          label="First Name"
          name="firstName"
          autocomplete="false"
          required
        >
          <Input
            parsing="number"
            v-model="state.firstName"
            autocomplete="false"
          />
        </UFormGroup>

        <UFormGroup label="Last Name" name="lastName" class="mt-3" required>
          <Input v-model="state.lastName" autocomplete="false" />
        </UFormGroup>

        <UFormGroup label="age" name="lastName" class="mt-3" required>
          <Input parsing="text" v-model="state.age" autocomplete="false" />
        </UFormGroup>

        <div class="flex justify-center mt-5 w-full">
          <UButton
            class="w-full ml-auto mr-auto block"
            type="submit"
            variant="solid"
            color="blue"
          >
            Submit
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped></style>
