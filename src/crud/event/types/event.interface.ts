export interface ApiShowsResponse {
  shows: ApiShow[]
}

export interface ApiShow {
  id: number
  name: string
  image?: string
  desc?: string
  partner_id: number
  age_limit: number
  short_info?: string
  full_info?: string
  publ_date?: string
  premiere_date?: string
  duration?: string
  min_price?: string
  max_price?: string
  is_pushkin: boolean
  type_num?: string
  events: ApiEvent[]
  show_categories: ApiShowCategory[]
}

export interface ApiEvent {
  id: number
  time_type: number
  date: string
  fix_date: string
  end_date: string
  timestamp: number
  name: string
  show_id: number
  location_id: number
  location_name: string
  service_name: string
  count: number
  min_price: string
  max_price: string
  image: string
  age_limit: number
  desc: string
  city_id: number
  address: string
  is_season: boolean
  is_covid_free: boolean
  building: ApiBuilding
  pipeline_event_id: number
  is_access_only_link: boolean
}

export interface ApiBuilding {
  id: number
  name: string
  city_id: number
  address: string
  lat: string
  lon: string
}

export interface ApiShowCategory {
  id: number
  name: string
}
