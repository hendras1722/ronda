<template>
  <div class="flex justify-center items-center">
    <button @click="changeImage(-1)">
      <UButton>
        <UIcon :name="'i-heroicons-arrow-left-circle-20-solid'" class="lg:text-[80px] text-[28px]" />
      </UButton>
    </button>
    <div id="images-container" class="relative flex items-center justify-center">
      <div v-for="imageIndex in [-1, 0, 1]" :key="imageIndex" class="relative">
        <UIcon :name="'i-ion-ios-home'" class="lg:text-[308px] text-[62px]"
          :class="['month-button', { active: isActiveImage(imageIndex), 'lg:w-48 text-gray-300': !isActiveImage(imageIndex) }]">
        </UIcon>
        <span v-if="imageIndex === 1 && !isActiveImage(imageIndex)"
          class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-0 text-white text-[10px] -mt-2 lg:text-[30px]"
          @click="changeImage(1)">
          {{ getImageUrl(currentSetIndex + imageIndex)?.block }}
        </span>
        <span v-else-if="imageIndex === 0 && !isActiveImage(imageIndex)"
          class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-0 text-white text-[10px] -mt-2 lg:text-[30px]"
          @click="changeImage(1)">
          {{ getImageUrl(currentSetIndex + imageIndex)?.block }}
        </span>
        <span v-else
          class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center z-0 text-white text-[10px] -mt-2 lg:text-[30px]"
          @click="changeImage(1)">
          {{ getImageUrl(currentSetIndex + imageIndex)?.block }}
        </span>
      </div>
    </div>
    <button @click="changeImage(1)">
      <UButton icon>
        <UIcon :name="'i-heroicons-arrow-right-circle-20-solid'" class="lg:text-[80px] text-[28px]" />
      </UButton>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  item: {
    type: Array,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: Object,
    default: () => { },
  }
});


const currentSetIndex = ref(0);

const numImages = computed(() => props.item.length);

const getImageUrl = (index) => {
  const adjustedIndex = (index + numImages.value) % numImages.value;
  return props.item[adjustedIndex];
};

const changeImage = (direction) => {
  currentSetIndex.value = (currentSetIndex.value + direction + numImages.value) % numImages.value;
};

const isActiveImage = (imageIndex) => {
  return imageIndex === 0; // Gambar tengah selalu aktif
};


const emits = defineEmits(['update:modelValue']);

const Vmodel = computed({
  get() {
    return props.modelValue
  },
  set(e) {
    emits('update:modelValue', e)
  }
})

watchEffect(() => {
  if (props.item || props.item.length > 0) {
    Vmodel.value = props.item[currentSetIndex.value]
  }
})

</script>

<style scoped>
.image-slider {
  display: flex;
  align-items: center;
}

#images-container {
  display: flex;
  gap: 10px;
}

.image-button {
  width: 100px;
  /* Adjust as needed */
  height: 100px;
  /* Adjust as needed */
  border: 2px solid transparent;
  cursor: pointer;
}

.month-button.active {
  border-color: blue;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Prevents image distortion */
}
</style>