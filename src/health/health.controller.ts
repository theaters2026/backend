import { Controller, Get } from '@nestjs/common'
import { Public } from 'src/common/decorators'

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return { status: 'ok' }
  }
}
