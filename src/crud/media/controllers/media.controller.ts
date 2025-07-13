import { Controller, Post, Req, UseInterceptors } from '@nestjs/common'
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { MediaService } from '../service/media.service'
import { FastifyRequest } from 'fastify'
import { UploadFileInterceptor } from '../interceptors/upload-file.interceptor'

@ApiTags('Media Management')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(UploadFileInterceptor)
  @ApiOperation({
    summary: 'Upload media files',
    description: 'Upload images and videos associated with user card',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'Files successfully uploaded',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Files uploaded successfully',
        },
        videoUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Uploaded video file paths',
        },
        photoUrls: {
          type: 'array',
          items: { type: 'string' },
          description: 'Uploaded image file paths',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid file type or missing user_card_id',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async uploadFile(@Req() request: FastifyRequest) {
    return this.mediaService.saveMediaStream(request.uploadPaths!, request.user_card_id!, request)
  }
}
