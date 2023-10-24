<template>
  <div>
    <div>Fruit</div>

    <div class="mt-3">
      <div class="flex justify-end">
        <div class="w-full md:w-fit">
          <UInput
            icon="i-heroicons-magnifying-glass-20-solid"
            color="white"
            variant="outline"
            name="input"
            placeholder="Search..."
          />
        </div>
      </div>
      <div class="mt-5 overflow-auto">
        <MSATable
          :rows="items"
          :columns="columns"
          class="border border-gray-300 rounded-2xl overflow-auto dark:text-white table-fixed"
        >
          <template #label-data="{ row, index }">
            {{ row.name }}
          </template>
          <template #quantity-data="{ row }">
            {{ row.quantity.value }}
          </template>
          <template #actions-data="{ index }">
            <UButton color="gray" variant="ghost" @click="handleTable(index)">
              <UIcon
                :name="
                  helloworld === index
                    ? 'i-heroicons-chevron-up'
                    : 'i-heroicons-chevron-down'
                "
              ></UIcon
            ></UButton>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
              @click="handleTable(index)"
            />
          </template>
          <template #expanded="{ rows, index }">
            <td
              :colspan="columns.length"
              v-if="helloworld === index"
              class="p-3"
            >
              <div class="before:content-['•']">{{ ' ' }}{{ rows.name }}</div>
              <div class="before:content-['•']">
                {{ ' ' }}{{ rows.quantity.value }}
              </div>
            </td>
          </template>
        </MSATable>
        <div class="mt-3 flex justify-center">
          <UPagination
            v-model="page"
            :active-button="{ variant: 'outline' }"
            :inactive-button="{ color: 'gray' }"
            :value="1"
            :total="100"
            :ui="{ rounded: 'rounded-lg' }"
          >
            <template #prev="{ onClick }">
              <UTooltip text="Previous page">
                <UButton
                  icon="i-heroicons-arrow-small-left-20-solid "
                  color="primary"
                  :ui="{ rounded: 'rounded-full' }"
                  class="rtl:[&_span:first-child]:rotate-180 me-2 dark:bg-gray-800 dark:text-white"
                  @click="onClick"
                />
              </UTooltip>
            </template>

            <template #next="{ onClick }">
              <UTooltip text="Next page">
                <UButton
                  icon="i-heroicons-arrow-small-right-20-solid"
                  color="primary"
                  :ui="{ rounded: 'rounded-full' }"
                  class="rtl:[&_span:last-child]:rotate-180 ms-2 dark:bg-gray-800 dark:text-white"
                  @click="onClick"
                />
              </UTooltip>
            </template>
          </UPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const helloworld = ref(null)
const page = ref(1)
const handleTable = (e: any) => {
  if (e === helloworld.value) {
    helloworld.value = null
    return
  }
  helloworld.value = e
}
const columns = [
  {
    key: 'id',
    label: '#',
  },
  {
    key: 'label',
    label: 'Label',
    class: 'italic', // Apply style to column header
  },
  {
    key: 'quantity',
    label: 'Quantity',
  },
  {
    key: 'actions',
  },
]
const items = [
  {
    id: 1,
    name: 'Apple',
    quantity: { value: 100 }, // Apply style to td
  },
  {
    id: 2,
    name: 'Orange',
    quantity: { value: 1 },
  },
  {
    id: 3,
    name: 'Banana',
    quantity: { value: 30 },
  },
  {
    id: 4,
    name: 'Mango',
    quantity: { value: 5 },
  },
]
</script>

<style scoped></style>
