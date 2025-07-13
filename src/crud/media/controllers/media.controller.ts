import { Controller, Post, Req, UseInterceptors } from '@nestjs/common'
import { MediaService } from '../service/media.service'
import { UploadFileInterceptor } from '../upload.interceptor'
import { FastifyRequest } from 'fastify'

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(UploadFileInterceptor)
  async uploadFile(@Req() request: FastifyRequest) {
    return this.mediaService.saveMediaStream(
      request.uploadPaths!,
      request.user_card_id!,
      request,
    )
  }
}
