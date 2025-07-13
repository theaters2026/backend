import { Injectable, Logger } from '@nestjs/common'
import { MultipartFile } from '@fastify/multipart'
import * as path from 'path'
import { FILE_TYPES, AllowedMimeType, AllowedExtension } from '../constants'
import { UPLOAD_FOLDERS, UploadFolder } from '../constants'
import { InvalidFileTypeError, ErrorHandlerService } from '../errors'

@Injectable()
export class FileValidationService {
  private readonly logger = new Logger(FileValidationService.name)

  constructor(private readonly errorHandler: ErrorHandlerService) {}

  validateFile(file: MultipartFile): void {
    try {
      this.logger.log(`✅ File received: ${file.filename}`)

      const fileExtension = path.extname(file.filename).toLowerCase()

      if (!this.isValidFileType(file.mimetype, fileExtension)) {
        this.logger.error('❌ Error: Invalid file type')
        throw new InvalidFileTypeError(file.mimetype, file.filename)
      }
    } catch (error) {
      this.errorHandler.handleError(error, 'file validation')
    }
  }

  getSubFolder(fileExtension: string): UploadFolder {
    if (this.isImageExtension(fileExtension)) {
      return UPLOAD_FOLDERS.PICTURES
    } else if (this.isVideoExtension(fileExtension)) {
      return UPLOAD_FOLDERS.VIDEOS
    }
    return UPLOAD_FOLDERS.OTHER
  }

  private isValidFileType(mimeType: string, extension: string): boolean {
    return this.isAllowedMimeType(mimeType) || this.isAllowedExtension(extension)
  }

  private isAllowedMimeType(mimeType: string): boolean {
    return [...FILE_TYPES.IMAGE.MIME_TYPES, ...FILE_TYPES.VIDEO.MIME_TYPES].includes(
      mimeType as AllowedMimeType,
    )
  }

  private isAllowedExtension(extension: string): boolean {
    return [...FILE_TYPES.IMAGE.EXTENSIONS, ...FILE_TYPES.VIDEO.EXTENSIONS].includes(
      extension as AllowedExtension,
    )
  }

  private isImageExtension(extension: string): boolean {
    return FILE_TYPES.IMAGE.EXTENSIONS.includes(extension as never)
  }

  private isVideoExtension(extension: string): boolean {
    return FILE_TYPES.VIDEO.EXTENSIONS.includes(extension as never)
  }
}
