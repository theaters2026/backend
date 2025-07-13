import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { FastifyRequest } from 'fastify'
import { MultipartFile } from '@fastify/multipart'
import { createWriteStream, promises as fsPromises } from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

declare module 'fastify' {
  interface FastifyRequest {
    uploadedFiles?: MultipartFile[]
    user_card_id?: string
    uploadPaths?: string[]
  }
}

@Injectable()
export class UploadFileInterceptor implements NestInterceptor {
  private readonly logger = new Logger(UploadFileInterceptor.name)

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    let uploadedFiles: MultipartFile[] = []
    let user_card_id: string | null = null
    let partNumber = 1
    let uploadPaths: string[] = []

    this.logger.log('🟢 Starting file upload request processing')

    try {
      if (!request.isMultipart()) {
        throw new BadRequestException('Request is not multipart')
      }

      this.logger.log('✅ Multipart request detected, processing parts')

      for await (const part of request.parts()) {
        this.logger.log(
          `📌 Processing part #${partNumber}: ${part.fieldname}, type: ${part.type}`,
        )

        if (part.type === 'file' && part.fieldname === 'file') {
          this.logger.log(`✅ File received: ${part.filename}`)

          const allowedMimeTypes = [
            'image/jpeg',
            'image/png',
            'video/mp4',
            'video/webm',
            'video/x-msvideo',
          ]
          const allowedExtensions = [
            '.jpeg',
            '.jpg',
            '.png',
            '.mp4',
            '.webm',
            '.avi',
          ]
          const fileExtension = path.extname(part.filename).toLowerCase()

          if (
            !allowedMimeTypes.includes(part.mimetype) &&
            !allowedExtensions.includes(fileExtension)
          ) {
            this.logger.error('❌ Error: Invalid file type')
            throw new BadRequestException(
              'Invalid file type. Only images and videos are supported.',
            )
          }

          const fileUuid = uuidv4()
          const fileName = `${fileUuid}${fileExtension}`
          const userId = request.session?.user?.user_id
          let user_card_id = request.session.user_card_id

          let subFolder = 'other'
          if (['.jpeg', '.jpg', '.png'].includes(fileExtension)) {
            subFolder = 'pictures'
          } else if (['.mp4', '.webm', '.avi'].includes(fileExtension)) {
            subFolder = 'videos'
          }

          const uploadDir = path.join(
            process.cwd(),
            'static',
            userId,
            user_card_id,
            subFolder,
          )
          const uploadPath = path.join(uploadDir, fileName)

          await fsPromises.mkdir(uploadDir, { recursive: true })
          const fileStream = createWriteStream(uploadPath)
          part.file.pipe(fileStream)

          fileStream.on('open', () =>
            this.logger.log(`🟡 Starting file write: ${uploadPath}`),
          )
          fileStream.on('finish', () =>
            this.logger.log(`🟢 File uploaded successfully: ${uploadPath}`),
          )
          fileStream.on('error', (err) => {
            this.logger.error('❌ Error writing file:', err)
            throw new BadRequestException('Error uploading file')
          })

          uploadedFiles.push(part)
          uploadPaths.push(uploadPath)
        }

        if (part.type === 'field' && part.fieldname === 'user_card_id') {
          user_card_id = part.value as string
          this.logger.log(`✅ Received user_card_id: ${user_card_id}`)
        }

        partNumber++
      }

      this.logger.log('✅ Completed processing all request parts')

      if (uploadedFiles.length === 0) {
        this.logger.error('❌ Error: No files uploaded')
        throw new BadRequestException('No files uploaded')
      }

      user_card_id = request.session.user_card_id

      if (!user_card_id) {
        this.logger.error('❌ Error: user_card_id not specified')
        throw new BadRequestException('user_card_id not specified')
      }

      request.uploadedFiles = uploadedFiles
      request.user_card_id = user_card_id
      request.uploadPaths = uploadPaths

      this.logger.log(
        '🟢 Request processing completed successfully, passing control forward',
      )
      return next.handle()
    } catch (error) {
      this.logger.error(`❌ Error processing files: ${error.message}`)
      throw new BadRequestException(`Error processing files: ${error.message}`)
    }
  }
}
