import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as mime from 'mime-types'
import { FastifyRequest } from 'fastify'
import { MEDIA_TYPES, MediaType } from '../constants'

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name)

  constructor(private prisma: PrismaService) {}

  async saveMediaStream(paths: string[], eventId: string, request: FastifyRequest) {
    try {
      for (const path of paths) {
        const fileType = mime.lookup(path)

        if (!fileType) {
          throw new Error('Could not determine file type')
        }

        const mediaType = this.getMediaType(fileType)

        await this.prisma.eventMedia.create({
          data: {
            eventId,
            url: path,
            type: mediaType,
          },
        })

        this.logger.log(`✅ Media saved for event ${eventId}: ${path}`)
      }

      return {
        message: 'Files uploaded successfully',
        paths,
        eventId,
      }
    } catch (error) {
      this.logger.error('❌ Error during file save:', error)
      throw new Error('Error while saving the file')
    } finally {
      request.userCardId = null
    }
  }

  private getMediaType(fileType: string): MediaType {
    if (fileType.startsWith('video/')) {
      return MEDIA_TYPES.VIDEO
    } else if (fileType.startsWith('image/')) {
      return MEDIA_TYPES.IMAGE
    } else {
      throw new Error('Unsupported file type')
    }
  }
}
