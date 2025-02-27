<template>
  <div :class="ui.wrapper" v-bind="attrs">
    <table :class="[ui.base, ui.divide]">
      <thead :class="ui.thead">
        <tr :class="ui.tr.base">
          <th v-if="modelValue" scope="col" :class="ui.checkbox.padding">
            <UCheckbox
              :checked="indeterminate || selected.length === rows.length"
              :indeterminate="indeterminate"
              aria-label="Select all"
              @change="onChange"
            />
          </th>

          <th
            v-for="(column, index) in columns"
            :key="index"
            scope="col"
            :class="[
              ui.th.base,
              ui.th.padding,
              ui.th.color,
              ui.th.font,
              ui.th.size,
              column.class,
            ]"
          >
            <slot
              :name="`${column.key}-header`"
              :column="column"
              :sort="sort"
              :on-sort="onSort"
            >
              <UButton
                v-if="column.sortable"
                v-bind="{ ...ui.default.sortButton, ...sortButton }"
                :icon="
                  !sort.column || sort.column !== column.key
                    ? sortButton.icon || ui.default.sortButton.icon
                    : sort.direction === 'asc'
                    ? sortAscIcon
                    : sortDescIcon
                "
                :label="column[columnAttribute]"
                @click="onSort(column)"
              />
              <span v-else>{{ column[columnAttribute] }}</span>
            </slot>
          </th>
        </tr>
      </thead>
      <tbody :class="ui.tbody">
        <tr v-if="loadingState && loading">
          <td :colspan="columns.length + (modelValue ? 1 : 0)">
            <slot name="loading-state">
              <div :class="ui.loadingState.wrapper">
                <UIcon
                  v-if="loadingState.icon"
                  :name="loadingState.icon"
                  :class="ui.loadingState.icon"
                  aria-hidden="true"
                />
                <p :class="ui.loadingState.label">
                  {{ loadingState.label }}
                </p>
              </div>
            </slot>
          </td>
        </tr>

        <tr v-else-if="emptyState && !rows.length">
          <td :colspan="columns.length + (modelValue ? 1 : 0)">
            <slot name="empty-state">
              <div :class="ui.emptyState.wrapper">
                <UIcon
                  v-if="emptyState.icon"
                  :name="emptyState.icon"
                  :class="ui.emptyState.icon"
                  aria-hidden="true"
                />
                <p :class="ui.emptyState.label">
                  {{ emptyState.label }}
                </p>
              </div>
            </slot>
          </td>
        </tr>

        <template v-else v-for="(row, index) in rows" :key="index">
          <tr
            :class="[
              ui.tr.base,
              isSelected(row) && ui.tr.selected,
              $attrs.onSelect && ui.tr.active,
              row?.class,
            ]"
            @click="() => onSelect(row)"
          >
            <td v-if="modelValue" :class="ui.checkbox.padding">
              <UCheckbox
                v-model="selected"
                :value="row"
                aria-label="Select row"
                @click.stop
              />
            </td>

            <td
              v-for="(column, subIndex) in columns"
              :key="subIndex"
              :class="[
                ui.td.base,
                ui.td.padding,
                ui.td.color,
                ui.td.font,
                ui.td.size,
                row[column.key]?.class,
              ]"
            >
              <slot
                v-if="column.key !== 'expanded'"
                :name="`${column.key}-data`"
                :column="column"
                :row="row"
                :index="index"
                :get-row-data="
                  (defaultValue) => getRowData(row, column.key, defaultValue)
                "
              >
                {{ getRowData(row, column.key) }}
              </slot>
            </td>
          </tr>
          <tr v-if="row.isExpanded">
            <td :colspan="columns.length">
              <slot name="expanded" :index="index" :rows="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, computed, defineComponent, toRaw, toRef } from 'vue'
import { upperFirst } from 'scule'
import { defu } from 'defu'
import { useUI } from '#ui/composables/useUI'
import { mergeConfig, omit, get } from '#ui/utils'
import appConfig from '#build/app.config'
import { table } from '#ui/ui.config'
const config = mergeConfig(appConfig.ui.strategy, appConfig.ui.table, table)
function defaultComparator(a, z) {
  return a === z
}
export default defineComponent({
  components: {},
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Array,
      default: null,
    },
    by: {
      type: [String, Function],
      default: () => defaultComparator,
    },
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: null,
    },
    columnAttribute: {
      type: String,
      default: 'label',
    },
    sort: {
      type: Object,
      default: () => ({}),
    },
    sortButton: {
      type: Object,
      default: () => config.default.sortButton,
    },
    sortAscIcon: {
      type: String,
      default: () => config.default.sortAscIcon,
    },
    sortDescIcon: {
      type: String,
      default: () => config.default.sortDescIcon,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingState: {
      type: Object,
      default: () => config.default.loadingState,
    },
    emptyState: {
      type: Object,
      default: () => config.default.emptyState,
    },
    class: {
      type: [String, Object, Array],
      default: void 0,
    },
    ui: {
      type: Object,
      default: void 0,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit, attrs: $attrs }) {
    const { ui, attrs } = useUI(
      'table',
      toRef(props, 'ui'),
      config,
      toRef(props, 'class')
    )
    const columns = computed(
      () =>
        props.columns ??
        Object.keys(omit(props.rows[0] ?? {}, ['click'])).map((key) => ({
          key,
          label: upperFirst(key),
          sortable: false,
        }))
    )
    const sort = ref(defu({}, props.sort, { column: null, direction: 'asc' }))
    const rows = computed(() => {
      if (!sort.value?.column) {
        return props.rows
      }
      const { column, direction } = sort.value
      return props.rows.slice().sort((a, b) => {
        const aValue = a[column]
        const bValue = b[column]
        if (aValue === bValue) {
          return 0
        }
        if (direction === 'asc') {
          return aValue < bValue ? -1 : 1
        } else {
          return aValue > bValue ? -1 : 1
        }
      })
    })
    const selected = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      },
    })
    const indeterminate = computed(
      () =>
        selected.value &&
        selected.value.length > 0 &&
        selected.value.length < props.rows.length
    )
    const emptyState = computed(() => {
      if (props.emptyState === null) return null
      return { ...ui.value.default.emptyState, ...props.emptyState }
    })
    const loadingState = computed(() => {
      if (props.loadingState === null) return null
      return { ...ui.value.default.loadingState, ...props.loadingState }
    })
    function compare(a, z) {
      if (typeof props.by === 'string') {
        const property = props.by
        return a?.[property] === z?.[property]
      }
      return props.by(a, z)
    }
    function isSelected(row) {
      if (!props.modelValue) {
        return false
      }
      return selected.value.some((item) => compare(toRaw(item), toRaw(row)))
    }
    function onSort(column) {
      if (sort.value.column === column.key) {
        const direction =
          !column.direction || column.direction === 'asc' ? 'desc' : 'asc'
        if (sort.value.direction === direction) {
          sort.value = defu({}, props.sort, { column: null, direction: 'asc' })
        } else {
          sort.value.direction = sort.value.direction === 'asc' ? 'desc' : 'asc'
        }
      } else {
        sort.value = {
          column: column.key,
          direction: column.direction || 'asc',
        }
      }
    }
    function onSelect(row) {
      if (!$attrs.onSelect) {
        return
      }
      $attrs.onSelect(row)
    }
    function selectAllRows() {
      props.rows.forEach((row) => {
        if (selected.value.some((item) => compare(toRaw(item), toRaw(row)))) {
          return
        }
        $attrs.onSelect ? $attrs.onSelect(row) : selected.value.push(row)
      })
    }
    function onChange(event) {
      if (event.target.checked) {
        selectAllRows()
      } else {
        selected.value = []
      }
    }
    function getRowData(
      row,
      rowKey,
      defaultValue = 'Failed to get cell value'
    ) {
      return get(row, rowKey, defaultValue)
    }
    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      // eslint-disable-next-line vue/no-dupe-keys
      sort,
      // eslint-disable-next-line vue/no-dupe-keys
      columns,
      // eslint-disable-next-line vue/no-dupe-keys
      rows,
      selected,
      indeterminate,
      // eslint-disable-next-line vue/no-dupe-keys
      emptyState,
      // eslint-disable-next-line vue/no-dupe-keys
      loadingState,
      isSelected,
      onSort,
      onSelect,
      onChange,
      getRowData,
    }
  },
})
</script>

<style lang="scss" scoped>
thead th {
  @apply dark:bg-gray-900 bg-white;
  @apply dark:text-white text-black;
  @apply sticky -top-5;
}
</style>
