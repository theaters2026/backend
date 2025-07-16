import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { ApiShowsResponse } from '../types/api-types'
import axios, { AxiosResponse } from 'axios'

@Injectable()
export class ExternalApiService {
  private readonly logger = new Logger(ExternalApiService.name)
  private readonly API_BASE_URL = 'https://tickets.afisha.ru/wl'

  async fetchShowsFromApi(shopId: string): Promise<ApiShowsResponse> {
    try {
      const response: AxiosResponse<ApiShowsResponse> = await axios.post(
        `${this.API_BASE_URL}/${shopId}/api/shows`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 seconds timeout
        },
      )

      return response.data
    } catch (error) {
      this.logger.error(`Failed to fetch data from API for shop_id: ${shopId}`, error.stack)
      throw new InternalServerErrorException('Failed to fetch data from external API')
    }
  }
}
