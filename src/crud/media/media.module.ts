import { Module } from '@nestjs/common'
import { UploadFileInterceptor } from './interceptors/upload-file.interceptor'
import { FileValidationService } from './service/file-validation.service'
import { FileUploadService } from './service/file-upload.service'
import { MultipartProcessorService } from './service/multipart-processor.service'

@Module({
  providers: [
    UploadFileInterceptor,
    FileValidationService,
    FileUploadService,
    MultipartProcessorService,
  ],
  exports: [UploadFileInterceptor],
})
export class UploadModule {}
