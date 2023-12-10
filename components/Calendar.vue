<template>
  <VDatePicker v-if="range" v-model.range="date" :popover="popover">
    <template #default="{ inputValue, inputEvents }">
      <slot
        :inputValue="inputValue"
        :inputEvents="inputEvents"
        :result="date"
      />
    </template>
  </VDatePicker>
  <VDatePicker v-else v-model="dateNoRange" :popover="popover">
    <template #default="{ inputValue, inputEvents }">
      <slot
        :inputValue="inputValue"
        :inputEvents="inputEvents"
        :result="dateNoRange"
      />
    </template>
  </VDatePicker>
  <!-- <VDatePicker v-else v-model="updateValue" :popover="popover" is-range>
    <template #default="{ inputValue, inputEvents }">
      <slot :inputValue="inputValue" :inputEvents="inputEvents" />
    </template>
  </VDatePicker> -->
</template>

<script setup lang="ts">
import type { PropType } from 'nuxt/dist/app/compat/capi'
const date = ref({
  start: new Date(),
  end: new Date(),
})

const dateNoRange = ref(new Date())
type PopoverVisibility = 'click' | 'hover' | 'hover-focus' | 'focus'
interface IPopover {
  placement?:
    | 'auto'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
  autoHide?: boolean // Auto-hide popover based on visibility
  showDelay?: number // Delay (ms) before popover is shown
  hideDelay?: number // Delay (ms) before popover is hidden
  visibility?: PopoverVisibility // When the popover appears
}
const props = defineProps({
  modelValue: {
    type: Date as PropType<Date>,
    default: () => new Date(),
  },
  // modelModifiers: { default: () => ({}) },
  range: {
    type: Boolean,
    default: false,
  },
  popover: {
    type: Object as PropType<IPopover>,
    default: {
      placement: 'auto',
      autoHide: true,
      showDelay: 0,
      hideDelay: 0,
      visibility: 'click',
    },
  },
})

// const emit = defineEmits(['update:modelValue'])
// const updateValue = computed({
//   set(e) {
//     emit('update:modelValue', e)
//   },
//   get() {
//     return props.modelValue
//   },
// })
</script>

<style scoped lang="scss">
@import url('@/assets/scss/calendar.scss');
</style>
