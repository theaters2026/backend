import { Controller, Get, Param, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CityUpdaterService } from '../services'
import { Public } from 'src/common/decorators'

@ApiTags('City Updater')
@Controller('city-updater')
export class CityUpdaterController {
  constructor(private readonly cityUpdaterService: CityUpdaterService) {}

  @Public()
  @Post('update-all')
  @ApiOperation({ summary: 'Update city_id for all events based on address' })
  @ApiResponse({ status: 200, description: 'City update process started' })
  async updateAllEventCities(): Promise<{ message: string }> {
    this.cityUpdaterService.updateCityIdForEvents().catch((error) => {
      console.error('Error in background city update:', error)
    })

    return { message: 'City update process started' }
  }

  @Public()
  @Post('update/:eventId')
  @ApiOperation({ summary: 'Update city_id for specific event' })
  @ApiResponse({ status: 200, description: 'Event city updated successfully' })
  async updateEventCity(@Param('eventId') eventId: string): Promise<{ message: string }> {
    await this.cityUpdaterService.updateCityIdForEvent(eventId)
    return { message: `City updated for event ${eventId}` }
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get statistics about city updates' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getCityUpdateStats() {
    return await this.cityUpdaterService.getCityUpdateStats()
  }
}
