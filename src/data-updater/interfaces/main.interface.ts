export interface GeocodingResult {
  lat: number
  lon: number
  city?: string
  cityId?: number
}

export interface CityFromList {
  id: number
  name: string
  state: string
  country: string
  coord: {
    lon: number
    lat: number
  }
}

export interface CityUpdateStats {
  eventsWithAddress: number
  eventsWithCityId: number
  eventsWithoutCityId: number
}
