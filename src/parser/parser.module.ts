import { Module } from '@nestjs/common'
import { ParserService } from './services/parser.service'
import { ParserController } from './controllers/parser.controller'
import { PrismaService } from '../prisma/prisma.service'
import { PythonExecutorService } from './services/python-executor.service'

@Module({
  controllers: [ParserController],
  providers: [ParserService, PrismaService, PythonExecutorService],
  exports: [ParserService],
})
export class ParserModule {}
