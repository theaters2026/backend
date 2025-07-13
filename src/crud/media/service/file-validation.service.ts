import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { MultipartFile } from '@fastify/multipart'
import * as path from 'path'
import { UPLOAD_CONSTANTS } from '../constants/upload.constants'

@Injectable()
export class FileValidationService {
  private readonly logger = new Logger(FileValidationService.name)

  validateFile(file: MultipartFile): void {
    this.logger.log(`✅ File received: ${file.filename}`)

    const fileExtension = path.extname(file.filename).toLowerCase()

    if (!this.isValidFileType(file.mimetype, fileExtension)) {
      this.logger.error('❌ Error: Invalid file type')
      throw new BadRequestException('Invalid file type. Only images and videos are supported.')
    }
  }

  getSubFolder(fileExtension: string): string {
    if ((UPLOAD_CONSTANTS.IMAGE_EXTENSIONS as readonly string[]).includes(fileExtension)) {
      return UPLOAD_CONSTANTS.SUBFOLDERS.PICTURES
    } else if ((UPLOAD_CONSTANTS.VIDEO_EXTENSIONS as readonly string[]).includes(fileExtension)) {
      return UPLOAD_CONSTANTS.SUBFOLDERS.VIDEOS
    }
    return UPLOAD_CONSTANTS.SUBFOLDERS.OTHER
  }

  private isValidFileType(mimeType: string, extension: string): boolean {
    return (
      (UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType) ||
      (UPLOAD_CONSTANTS.ALLOWED_EXTENSIONS as readonly string[]).includes(extension)
    )
  }
}
