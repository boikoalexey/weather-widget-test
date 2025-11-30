<template>
  <div class="weather-widget">
    <div v-if="!showSettings" class="weather-widget__main">
      <div class="weather-widget__header">
        <h2 class="weather-widget__title">Weather Widget</h2>
        <button
          class="weather-widget__settings-btn"
          aria-label="Open settings"
          @click="showSettings = true"
        >
          <IconSettings />
        </button>
      </div>

      <div
        v-if="cities.length === 0 && !initializing"
        class="weather-widget__empty"
      >
        <p>No locations added yet.</p>
        <p>Click the settings icon to add your first city!</p>
      </div>

      <div v-else-if="initializing" class="weather-widget__initializing">
        <div class="spinner"></div>
        <p>Loading...</p>
      </div>

      <div v-else class="weather-widget__cities">
        <CityCard v-for="city in cities" :city="city" :key="city.id" />
      </div>
    </div>

    <div v-else class="weather-widget__settings">
      <SettingsView
        :cities="cities"
        :on-add-city="handleAddCity"
        @close="showSettings = false"
        @remove-city="handleRemoveCity"
        @reorder-cities="handleReorderCities"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import CityCard from '../components/CityCard.vue'
import SettingsView from './SettingsView.vue'
import { WeatherService } from '@/services/weatherService'
import { StorageService } from '@/services/storageService'
import { GeolocationService } from '@/services/geolocationService'
import type { City } from '@/types'
import IconSettings from '@/components/icons/IconSettings.vue'

interface Props {
  apiKey: string
}

const props = defineProps<Props>()

const cities = ref<City[]>([])
const showSettings = ref(false)
const initializing = ref(true)

const weatherService = new WeatherService(props.apiKey)
const storageService = new StorageService()
const geolocationService = new GeolocationService()

const loadWeatherForCity = async (city: City) => {
  city.loading = true
  city.error = undefined

  try {
    city.weather = await weatherService.getWeatherByCity(city.name)
  } catch (error: unknown) {
    city.error =
      error instanceof Error ? error.message : 'Failed to load weather'
    throw error
  } finally {
    city.loading = false
  }
}

const handleAddCity = async (
  cityName: string
): Promise<{ success: boolean; error?: string }> => {
  const exists = cities.value.some(
    (c) => c.name.toLowerCase() === cityName.toLowerCase()
  )

  if (exists) {
    return { success: false, error: 'City already added' }
  }

  const newCity: City = {
    id: Date.now().toString(),
    name: cityName,
    loading: true,
  }

  try {
    await loadWeatherForCity(newCity)
    cities.value.push(newCity)
    storageService.saveCities(cities.value)

    return { success: true }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to add city'
    return { success: false, error: errorMessage }
  }
}

const handleRemoveCity = (cityId: string) => {
  cities.value = cities.value.filter((c) => c.id !== cityId)
  storageService.saveCities(cities.value)
}

const handleReorderCities = (reorderedCities: City[]) => {
  cities.value = reorderedCities
  storageService.saveCities(cities.value)
}

const initializeWidget = async () => {
  initializing.value = true

  const savedCities = storageService.loadCities()

  if (savedCities.length > 0) {
    cities.value = savedCities
    await Promise.all(cities.value.map((city) => loadWeatherForCity(city)))
  } else {
    try {
      const coords = await geolocationService.getCurrentPosition()
      const weather = await weatherService.getWeatherByCoordinates(coords)

      const userCity: City = {
        id: Date.now().toString(),
        name: weather.name,
        weather: weather,
        loading: false,
      }

      cities.value = [userCity]
      storageService.saveCities(cities.value)
    } catch (error: unknown) {
      console.warn('Failed to get user location:', error)
    }
  }

  initializing.value = false
}

onMounted(() => {
  initializeWidget()
})
</script>

<style lang="scss" scoped>
.weather-widget {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;

  &__main {
    padding: $spacing-lg;
  }

  &__header {
    @include flex-between;
    margin-bottom: $spacing-lg;
  }

  &__title {
    margin: 0;
    font-size: $font-size-xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
  }

  &__settings-btn {
    @include reset-button;
    @include flex-center;
    background: $color-bg-light;
    border-radius: $border-radius-lg;
    width: $size-button-lg;
    height: $size-button-lg;
    color: $color-text-secondary;
    transition: $transition-background, $transition-color;

    &:hover {
      background: $color-bg-hover;
      color: $color-text-primary;
    }
  }

  &__empty {
    text-align: center;
    padding: $spacing-3xl $spacing-lg;
    color: $color-text-muted;

    p {
      margin: $spacing-xs 0;
      font-size: $font-size-base;

      &:first-child {
        font-weight: $font-weight-semibold;
        color: $color-text-secondary;
      }
    }
  }

  &__initializing {
    text-align: center;
    padding: $spacing-3xl $spacing-lg;
    color: $color-text-secondary;

    .spinner {
      margin: 0 auto $spacing-md;
    }

    p {
      margin: 0;
      font-size: $font-size-base;
    }
  }

  &__cities {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax($grid-min-column-width, 1fr)
    );
    gap: $grid-gap;
  }

  &__settings {
    @include flex-center;
    min-height: 400px;
    padding: $spacing-lg;
  }
}

.spinner {
  border-radius: $border-radius-round;
  border: 3px solid #f3f3f3;
  width: $size-spinner-sm;
  height: $size-spinner-sm;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: $breakpoint-mobile) {
  .weather-widget {
    &__cities {
      grid-template-columns: 1fr;
    }
  }
}
</style>
