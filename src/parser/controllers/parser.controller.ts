import { Controller, Get, Query } from '@nestjs/common'
import { ParserService } from '../services/parser.service'
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Public } from 'src/common/decorators'

@ApiTags('parser')
@Controller('sync-data')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Public()
  @Get('info')
  @ApiOperation({
    summary: 'Получить информацию с афиши',
    description:
      'Запускает парсинг данных с афиши и выводит информацию в консоль. Можно передать URL для парсинга конкретной страницы или оставить пустым для парсинга по умолчанию',
  })
  @ApiQuery({
    name: 'url',
    required: false,
    description: 'URL для парсинга конкретной страницы',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Информация успешно получена и выведена в консоль',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Внутренняя ошибка сервера при парсинге',
  })
  async getInfo(@Query('url') url?: string) {
    return this.parserService.getInfo(url)
  }
}
