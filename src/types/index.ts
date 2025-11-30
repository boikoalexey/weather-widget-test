export interface WeatherSystem {
  country: string
  sunrise?: number
  sunset?: number
}

export interface WeatherMain {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface Wind {
  speed: number
  deg?: number
  gust?: number
}

export interface Clouds {
  all: number
}

export interface WeatherData {
  id: number
  name: string
  sys: WeatherSystem
  main: WeatherMain
  weather: WeatherCondition[]
  wind: Wind
  clouds?: Clouds
  visibility: number
  dt: number
  timezone: number
  cod: number
  coord?: {
    lon: number
    lat: number
  }
}

export interface City {
  id: string
  name: string
  weather?: WeatherData
  loading?: boolean
  error?: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}
