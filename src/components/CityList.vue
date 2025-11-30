<template>
  <div class="city-list">
    <h3 class="city-list__title">Locations</h3>
    <div v-if="cities.length === 0" class="city-list__empty">
      No locations added yet
    </div>
    <div v-else class="city-list__items">
      <div
        v-for="(city, index) in localCities"
        class="city-list__item"
        :class="{ 'city-list__item--dragging': draggedIndex === index }"
        draggable="true"
        :key="city.id"
        @dragstart="handleDragStart(index, $event)"
        @dragend="handleDragEnd"
        @dragover.prevent="handleDragOver(index)"
        @drop="handleDrop"
      >
        <div class="city-list__item-drag">
          <IconDragHandle />
        </div>
        <div class="city-list__item-name">{{ city.name }}</div>
        <button
          class="city-list__item-remove"
          aria-label="Remove city"
          @click="$emit('remove-city', city.id)"
        >
          &times;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { City } from '@/types'
import IconDragHandle from '@/components/icons/IconDragHandle.vue'

interface Props {
  cities: City[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'remove-city': [cityId: string]
  'reorder-cities': [cities: City[]]
}>()

const localCities = ref<City[]>([...props.cities])
const draggedIndex = ref<number | null>(null)

watch(
  () => props.cities,
  (newCities) => {
    localCities.value = [...newCities]
  },
  { deep: true }
)

const handleDragStart = (index: number, event: DragEvent) => {
  draggedIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', index.toString())
  }
}

const handleDragEnd = () => {
  draggedIndex.value = null
}

const handleDragOver = (index: number) => {
  if (draggedIndex.value === null || draggedIndex.value === index) {
    return
  }

  const newCities = [...localCities.value]
  const draggedCity = newCities[draggedIndex.value]
  newCities.splice(draggedIndex.value, 1)
  newCities.splice(index, 0, draggedCity)

  localCities.value = newCities
  draggedIndex.value = index
}

const handleDrop = () => {
  if (draggedIndex.value === null) {
    return
  }
  emit('reorder-cities', localCities.value)
  draggedIndex.value = null
}
</script>

<style lang="scss" scoped>
.city-list {
  &__title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__empty {
    color: $color-text-muted;
    text-align: center;
    padding: $spacing-xl;
    font-size: $font-size-sm;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__item {
    display: flex;
    align-items: center;
    padding: $spacing-sm;
    background: $color-bg-light;
    border-radius: $border-radius-lg;
    cursor: move;
    transition: $transition-background, $transition-transform;
    @include hover-background;

    &--dragging {
      opacity: 0.5;
      transform: scale(0.95);
    }
  }

  &__item-drag {
    color: $color-text-muted;
    margin-right: $spacing-sm;
    display: flex;
    align-items: center;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  &__item-name {
    flex: 1;
    font-size: $font-size-sm;
    color: $color-text-primary;
    font-weight: $font-weight-medium;
  }

  &__item-remove {
    @include reset-button;
    @include flex-center;
    font-size: $font-size-xl;
    line-height: 1;
    color: $color-text-muted;
    width: $size-button-sm;
    height: $size-button-sm;
    transition: $transition-color;

    &:hover {
      color: $color-text-error;
    }
  }
}
</style>
