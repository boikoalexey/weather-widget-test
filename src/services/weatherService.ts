import type { WeatherData, Coordinates } from '@/types'

const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  ICON_BASE_URL: 'https://openweathermap.org/img/wn',
  UNITS: 'metric',
  ICON_SIZE: '2x',
} as const

export class WeatherService {
  private readonly apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getWeatherByCity(cityName: string): Promise<WeatherData> {
    const endpoint = `${API_CONFIG.BASE_URL}/weather`
    const params = new URLSearchParams({
      q: cityName,
      units: API_CONFIG.UNITS,
      appid: this.apiKey,
    })
    const url = `${endpoint}?${params.toString()}`

    return this.fetchWeatherData(url)
  }

  async getWeatherByCoordinates(coords: Coordinates): Promise<WeatherData> {
    const { latitude, longitude } = coords
    const endpoint = `${API_CONFIG.BASE_URL}/weather`
    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      units: API_CONFIG.UNITS,
      appid: this.apiKey,
    })
    const url = `${endpoint}?${params.toString()}`

    return this.fetchWeatherData(url)
  }

  private async fetchWeatherData(url: string): Promise<WeatherData> {
    const response = await fetch(url)

    if (!response.ok) {
      const error = await response.json()

      let message = 'Failed to fetch weather data'

      if (response.status === 404) {
        message = 'City not found. Please check the spelling.'
      } else if (response.status === 401) {
        message = 'Invalid API key. Please check your configuration.'
      } else if (response.status === 429) {
        message = 'Too many requests. Please try again later.'
      } else if (error.message) {
        message = error.message
      }

      throw new Error(message)
    }

    return response.json()
  }

  static getWeatherIconUrl(iconCode: string): string {
    return `${API_CONFIG.ICON_BASE_URL}/${iconCode}@${API_CONFIG.ICON_SIZE}.png`
  }
}
