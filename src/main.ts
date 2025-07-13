import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cliColor from 'cli-color'
import { registerFastifyPlugins } from './session/fastify.config'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import Fastify from 'fastify'
import { ZodValidationPipe } from './common/pipes/zod-validation.pipe'
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  logger.log(cliColor.green('✅ Starting NestJS (Fastify) application...'))
  logger.log('')

  const host = process.env.HOST || '0.0.0.0'
  const port = parseInt(process.env.BACKEND_PORT || '3000', 10)
  const baseUrl = `http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`

  const fastifyInstance = Fastify({
    bodyLimit: 100 * 1024 * 1024, // 100 MB
    connectionTimeout: 300000, // 5 minutes
  })

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(fastifyInstance),
  )

  app.useGlobalPipes(new ZodValidationPipe())

  await registerFastifyPlugins(app)

  const theme = new SwaggerTheme()
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest js api')
    .setDescription(
      `
      Nest-js
      boilerplate
      PrismaORM
      Postgres
      `,
    )
    .setVersion('6.6.6')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api', app as any, document, options)

  await app.listen(port, host)

  logger.log(cliColor.blue(`🌐 Application is running on: ${baseUrl}`))
  logger.log(
    cliColor.cyan(`📚 Swagger documentation available at: ${baseUrl}/api`),
  )
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap')
  logger.error(cliColor.red('❌ Error during bootstrap:'), error)
  process.exit(1)
})
