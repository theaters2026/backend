import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { MultipartFile } from '@fastify/multipart'
import { FileUploadService } from './file-upload.service'
import { ProcessedFile, UploadResult } from '../types/upload.types'

@Injectable()
export class MultipartProcessorService {
  private readonly logger = new Logger(MultipartProcessorService.name)

  constructor(private readonly fileUploadService: FileUploadService) {}

  async processMultipartRequest(
    request: FastifyRequest,
  ): Promise<UploadResult> {
    this.validateMultipartRequest(request)

    const uploadedFiles: MultipartFile[] = []
    const uploadPaths: string[] = []
    let user_card_id: string | null = null
    let partNumber = 1

    this.logger.log('✅ Multipart request detected, processing parts')

    for await (const part of request.parts()) {
      this.logger.log(
        `📌 Processing part #${partNumber}: ${part.fieldname}, type: ${part.type}`,
      )

      if (part.type === 'file' && part.fieldname === 'file') {
        const processedFile = await this.processFilePart(part, request)
        uploadedFiles.push(processedFile.file)
        uploadPaths.push(processedFile.uploadPath)
      }

      if (part.type === 'field' && part.fieldname === 'user_card_id') {
        user_card_id = part.value as string
        this.logger.log(`✅ Received user_card_id: ${user_card_id}`)
      }

      partNumber++
    }

    this.validateProcessingResults(uploadedFiles, user_card_id, request)

    return {
      uploadedFiles,
      uploadPaths,
      user_card_id: user_card_id || request.session.user_card_id,
    }
  }

  private validateMultipartRequest(request: FastifyRequest): void {
    if (!request.isMultipart()) {
      throw new BadRequestException('Request is not multipart')
    }
  }

  private async processFilePart(
    part: MultipartFile,
    request: FastifyRequest,
  ): Promise<ProcessedFile> {
    const userId = request.session?.user?.user_id
    const userCardId = request.session.user_card_id

    return await this.fileUploadService.processFile(part, {
      userId,
      userCardId,
      uploadDir: '',
    })
  }

  private validateProcessingResults(
    uploadedFiles: MultipartFile[],
    user_card_id: string | null,
    request: FastifyRequest,
  ): void {
    if (uploadedFiles.length === 0) {
      this.logger.error('❌ Error: No files uploaded')
      throw new BadRequestException('No files uploaded')
    }

    const finalUserCardId = user_card_id || request.session.user_card_id
    if (!finalUserCardId) {
      this.logger.error('❌ Error: user_card_id not specified')
      throw new BadRequestException('user_card_id not specified')
    }
  }
}
