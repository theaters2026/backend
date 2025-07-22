import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { CityFromList } from '../interfaces'

@Injectable()
export class CityListLoaderService {
  private readonly logger = new Logger(CityListLoaderService.name)
  private citiesList: CityFromList[] = []

  constructor() {
    this.loadCitiesList()
  }

  getCitiesList(): CityFromList[] {
    return this.citiesList
  }

  findCityInList(cityName: string): CityFromList | null {
    if (!this.citiesList || this.citiesList.length === 0) {
      return null
    }

    const exactMatchRU = this.citiesList.find(
      (city) => city.name.toLowerCase() === cityName.toLowerCase() && city.country === 'RU',
    )

    if (exactMatchRU) {
      return exactMatchRU
    }

    const exactMatch = this.citiesList.find(
      (city) => city.name.toLowerCase() === cityName.toLowerCase(),
    )

    if (exactMatch) {
      return exactMatch
    }

    const partialMatchRU = this.citiesList.find(
      (city) =>
        city.country === 'RU' &&
        (city.name.toLowerCase().includes(cityName.toLowerCase()) ||
          cityName.toLowerCase().includes(city.name.toLowerCase())),
    )

    if (partialMatchRU) {
      return partialMatchRU
    }

    const partialMatch = this.citiesList.find(
      (city) =>
        city.name.toLowerCase().includes(cityName.toLowerCase()) ||
        cityName.toLowerCase().includes(city.name.toLowerCase()),
    )

    if (partialMatch) {
      return partialMatch
    }

    return null
  }

  private loadCitiesList(): void {
    try {
      const filePath = path.join(process.cwd(), 'src', 'data-updater', 'services', 'city.list.json')

      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        this.citiesList = JSON.parse(fileContent)
        this.logger.log(`Loaded ${this.citiesList.length} cities from city.list.json`)
      } else {
        this.logger.warn('city.list.json file not found')
      }
    } catch (error) {
      this.logger.error(`Error loading city.list.json: ${error.message}`)
    }
  }
}
