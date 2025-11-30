<template>
  <div class="city-card" :class="{ 'city-card--loading': city.loading }">
    <div v-if="city.loading" class="city-card__loader">
      <div class="spinner"></div>
    </div>

    <div v-else-if="city.error" class="city-card__error">
      <p>{{ city.error }}</p>
    </div>

    <div v-else-if="city.weather" class="city-card__content">
      <div class="city-card__header">
        <h3 class="city-card__title">
          {{ city.weather.name }}, {{ city.weather.sys.country }}
        </h3>
      </div>

      <div class="city-card__main">
        <div class="city-card__icon">
          <img
            :src="getWeatherIconUrl(city.weather.weather[0].icon)"
            :alt="city.weather.weather[0].description"
          />
        </div>
        <div class="city-card__temp">
          {{ Math.round(city.weather.main.temp) }}&deg;C
        </div>
      </div>

      <div class="city-card__description">
        {{ city.weather.weather[0].description }}
      </div>

      <div class="city-card__details">
        <div
          v-for="detail in weatherDetails"
          class="city-card__detail"
          :key="detail.label"
        >
          <span class="city-card__detail-label">{{ detail.label }}:</span>
          <span class="city-card__detail-value">{{ detail.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { City } from '@/types'
import { WeatherService } from '@/services/weatherService'

interface Props {
  city: City
}

const props = defineProps<Props>()

const getWeatherIconUrl = WeatherService.getWeatherIconUrl

const weatherDetails = computed(() => {
  if (!props.city.weather) {
    return []
  }

  return [
    {
      label: 'Feels like',
      value: `${Math.round(props.city.weather.main.feels_like)}°C`,
    },
    {
      label: 'Wind',
      value: `${props.city.weather.wind.speed} m/s`,
    },
    {
      label: 'Humidity',
      value: `${props.city.weather.main.humidity}%`,
    },
    {
      label: 'Pressure',
      value: `${props.city.weather.main.pressure} hPa`,
    },
  ]
})
</script>

<style lang="scss" scoped>
.city-card {
  background: $gradient-primary;
  border-radius: $border-radius-xl;
  padding: $spacing-lg;
  color: $color-text-white;
  min-height: $city-card-min-height;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-md;
  @include hover-lift;

  &:hover {
    box-shadow: $shadow-lg;
  }

  &--loading {
    @include flex-center;
  }

  &__loader {
    @include flex-center;
    flex: 1;
  }

  &__error {
    color: $color-text-error-light;
    text-align: center;
    flex: 1;
    @include flex-center;
  }

  &__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  &__header {
    margin-bottom: $spacing-sm;
  }

  &__title {
    margin: 0;
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
  }

  &__main {
    display: flex;
    align-items: center;
    margin-bottom: $spacing-xs;
  }

  &__icon {
    img {
      width: $city-card-icon-size;
      height: $city-card-icon-size;
      margin: $city-card-icon-margin;
    }
  }

  &__temp {
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    margin-left: $spacing-xs;
  }

  &__description {
    text-transform: capitalize;
    font-size: $font-size-base;
    margin-bottom: $spacing-md;
    opacity: 0.9;
  }

  &__details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-xs;
    font-size: $font-size-xs;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    opacity: 0.85;

    &-label {
      font-weight: $font-weight-medium;
    }

    &-value {
      font-weight: $font-weight-semibold;
    }
  }
}

.spinner {
  border-radius: $border-radius-round;
  border: 3px solid rgba(255, 255, 255, 0.3);
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
</style>
