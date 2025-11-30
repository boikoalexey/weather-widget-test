<template>
  <div class="settings-view">
    <div class="settings-view__header">
      <h2 class="settings-view__title">Settings</h2>
      <button
        class="settings-view__close"
        aria-label="Close settings"
        @click="$emit('close')"
      >
        &times;
      </button>
    </div>

    <div class="settings-view__content">
      <div class="settings-view__section">
        <h3 class="settings-view__section-title">Add Location</h3>
        <form class="settings-view__form" @submit.prevent="handleAddCity">
          <input
            v-model="newCityName"
            type="text"
            class="settings-view__input"
            placeholder="Enter city name"
            :disabled="isAdding"
            @input="clearError"
          />
          <button
            type="submit"
            class="settings-view__button"
            :disabled="!newCityName.trim() || isAdding"
          >
            {{ isAdding ? 'Adding...' : 'Add' }}
          </button>
        </form>
        <div class="settings-view__error-container">
          <Transition name="error-fade">
            <p v-if="addError" class="settings-view__error">{{ addError }}</p>
          </Transition>
        </div>
      </div>

      <div class="settings-view__section">
        <CityList
          :cities="cities"
          @remove-city="handleRemoveCity"
          @reorder-cities="handleReorderCities"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { City } from '@/types'
import CityList from '../components/CityList.vue'

interface Props {
  cities: City[]
  onAddCity: (cityName: string) => Promise<{ success: boolean; error?: string }>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  'remove-city': [cityId: string]
  'reorder-cities': [cities: City[]]
}>()

const newCityName = ref('')
const isAdding = ref(false)
const addError = ref('')

const clearError = () => {
  addError.value = ''
}

const handleAddCity = async () => {
  const cityName = newCityName.value.trim()
  if (!cityName) {
    addError.value = 'Please enter a city name'
    return
  }

  isAdding.value = true
  addError.value = ''

  try {
    const result = await props.onAddCity(cityName)

    if (result.success) {
      newCityName.value = ''
      addError.value = ''
    } else {
      addError.value = result.error || 'Failed to add city'
    }
  } catch (error: unknown) {
    addError.value =
      error instanceof Error ? error.message : 'Failed to add city'
  } finally {
    isAdding.value = false
  }
}

const handleRemoveCity = (cityId: string) => {
  emit('remove-city', cityId)
}

const handleReorderCities = (reorderedCities: City[]) => {
  emit('reorder-cities', reorderedCities)
}
</script>

<style lang="scss" scoped>
.settings-view {
  background: $color-bg-white;
  border-radius: $border-radius-xl;
  box-shadow: $shadow-xl;
  max-width: $settings-max-width;
  width: 100%;
  overflow: hidden;

  &__header {
    @include flex-between;
    padding: $spacing-lg $spacing-xl;
    border-bottom: 1px solid $color-border-lighter;
  }

  &__title {
    margin: 0;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__close {
    @include reset-button;
    @include flex-center;
    font-size: $font-size-2xl;
    line-height: 1;
    color: $color-text-muted;
    width: $size-button-md;
    height: $size-button-md;
    transition: $transition-color;

    &:hover {
      color: $color-text-primary;
    }
  }

  &__content {
    padding: $spacing-xl;
    max-height: $settings-content-max-height;
    overflow-y: auto;
  }

  &__section {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__section-title {
    margin: 0 0 $spacing-sm;
    font-size: $font-size-base;
    font-weight: $font-weight-semibold;
    color: $color-text-primary;
  }

  &__form {
    display: flex;
    gap: $spacing-xs;
  }

  &__input {
    flex: 1;
    padding: 10px $spacing-sm;
    border: 1px solid $color-border-light;
    border-radius: $border-radius-md;
    font-size: $font-size-sm;
    transition: $transition-border;

    &:focus {
      outline: none;
      border-color: $color-border-focus;
    }

    &:disabled {
      background: $color-bg-lighter;
      cursor: not-allowed;
    }
  }

  &__button {
    padding: 10px $spacing-lg;
    background: $gradient-primary;
    color: $color-text-white;
    border: none;
    border-radius: $border-radius-md;
    font-size: $font-size-sm;
    font-weight: $font-weight-semibold;
    cursor: pointer;
    transition: $transition-opacity, $transition-transform;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  }

  &__error-container {
    min-height: 20px;
    display: flex;
    align-items: flex-start;
    padding-top: 4px;
  }

  &__error {
    color: $color-text-error;
    font-size: $font-size-xs;
    margin: 0;
  }
}

.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
