import { Controller, Get, Post, Param } from '@nestjs/common'
import { TypeUpdaterService } from '../services/type-updater.service'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'

@ApiTags('Type Updater')
@Controller('type-updater')
export class TypeUpdaterController {
  constructor(private readonly typeUpdaterService: TypeUpdaterService) {}

  @Public()
  @Post('update-all')
  @ApiOperation({ summary: 'Update type_num for all shows based on detailed_url' })
  @ApiResponse({
    status: 200,
    description: 'Type update completed',
  })
  async updateAllTypes() {
    const result = await this.typeUpdaterService.updateShowTypes()
    return {
      message: 'Type update completed',
      ...result,
    }
  }

  @Public()
  @Post('update/:id')
  @ApiOperation({ summary: 'Update type_num for single show' })
  async updateSingleShow(@Param('id') id: string) {
    const updated = await this.typeUpdaterService.updateSingleShow(id)
    return {
      message: updated ? 'Show updated successfully' : 'No update needed',
      updated,
    }
  }

  @Public()
  @Get('without-type')
  @ApiOperation({ summary: 'Get shows without type_num' })
  async getShowsWithoutType() {
    return this.typeUpdaterService.getShowsWithoutTypeNum()
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Get type statistics' })
  async getTypeStats() {
    return this.typeUpdaterService.getTypeStats()
  }
}
