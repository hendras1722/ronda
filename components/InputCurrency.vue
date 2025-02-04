<template>
  <div class="w-full">
    <div>
      <div class="relative">
        <span
          v-if="$slots.append"
          class="absolute top-1/2 left-4 -translate-y-1/2"
        >
          <slot name="append" />
        </span>
        <input
          type="tel"
          class="w-full bg-transparent rounded-md border py-[5px] text-dark-6 outline-none transition"
          :class="{
            'border-red-500': $props.error,
            'pl-12': $slots.append,
            'pr-12': $slots.trailing,
            'pr-5': !$slots.trailing,
            'pl-5': !$slots.append,
          }"
          @input="keyPress($event)"
          v-model="vModel"
          v-bind="$attrs"
        />

        <span
          v-if="$slots.trailing"
          class="absolute top-1/2 right-4 -translate-y-1/2"
        >
          <slot name="trailing" />
        </span>
      </div>
      <!-- <p class="my-[10px] text-sm text-red-500">Invalid email address</p> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const rawInput = ref('')

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:modelValue'])

const vModel = computed({
  get() {
    return props.modelValue
  },
  set(e) {
    emits('update:modelValue', e)
  },
})

const formatUang = (value: string): string => {
  const angkaBersih = value.replace(/[^\d]/g, '')
  if (angkaBersih === '') return ''
  return angkaBersih.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// type HTMLElementEvent<T extends HTMLElement> = Event & {
//   target: T;
// }

function keyPress(e: any) {
  if (!e) return
  const input = e.target as HTMLInputElement
  // Simpan nilai asli tanpa format
  const cleanedValue = input.value.replace(/[^\d]/g, '')
  // Pastikan input tidak dimulai dengan banyak nol
  rawInput.value = cleanedValue.replace(/^0+(?!$)/, '')
  // Format nilai untuk ditampilkan
  vModel.value = String(formatUang(rawInput.value)) // Format nilai input

  // const cursorPosition = input.selectionStart;
  // e.setSelectionRange(cursorPosition, cursorPosition)
}
</script>
