import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import * as mime from 'mime-types'
import { FastifyRequest } from 'fastify'

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async saveMediaStream(paths: string[], user_card_id: string, request: FastifyRequest) {
    try {
      const videoUrls: string[] = []
      const photoUrls: string[] = []

      for (const path of paths) {
        const fileType = mime.lookup(path)
        console.log('Content-Type', fileType)

        if (fileType) {
          if (fileType.startsWith('video/')) {
            videoUrls.push(path)
          } else if (fileType.startsWith('image/')) {
            photoUrls.push(path)
          } else {
            throw new Error('Unsupported file type')
          }
        } else {
          throw new Error('Could not determine file type')
        }
      }

      // if (videoUrls.length > 0) {
      //   await this.prisma.videos.create({
      //     data: {
      //       user_card_id: user_card_id,
      //       video_urls: videoUrls,
      //     },
      //   })
      // }

      // if (photoUrls.length > 0) {
      //   await this.prisma.photos.create({
      //     data: {
      //       user_card_id: user_card_id,
      //       photo_urls: photoUrls,
      //     },
      //   })
      // }
    } catch (error) {
      console.error('❌ Error during file save:', error)
      throw new Error('Error while saving the file')
    } finally {
      request.user_card_id = null
    }
  }
}
