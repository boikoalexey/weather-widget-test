import type { City } from '@/types'

const STORAGE_KEY = 'weather-widget-cities'

export class StorageService {
  saveCities(cities: City[]): void {
    try {
      const data = cities.map((city) => ({
        id: city.id,
        name: city.name,
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save cities to localStorage:', error)
    }
  }

  loadCities(): City[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        return []
      }

      const data = JSON.parse(stored)
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        loading: false,
      }))
    } catch (error) {
      console.error('Failed to load cities from localStorage:', error)
      return []
    }
  }
}
