import * as fastifyCookie from '@fastify/cookie'
import * as fastifySession from '@fastify/session'
import * as fastifyCors from '@fastify/cors'
import { customRedisStore } from './redis.provider'
import fastifyStatic from '@fastify/static'
import { join } from 'path'
import { fastifyMultipart } from '@fastify/multipart'

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
const allowedOrigins = frontendUrl.split(',').map((url) => url.trim())

export function registerFastifyPlugins(app) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 100 * 1024 * 1024, // максимальный размер файла 100 MB
      fieldSize: 2 * 1024 * 1024, // максимальный размер других полей
      parts: 100,
      files: 5,
      fieldNameSize: 1000,
    },
  })

  app.register(fastifyCors, {
    origin: allowedOrigins,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  })

  app.register(fastifyCookie)

  app.register(fastifyStatic, {
    root: join(process.cwd(), 'uploads'),
    prefix: '/uploads/',
    acceptRange: true,
    cacheControl: true,
    maxAge: '1d',
  })

  app.register(fastifyStatic, {
    root: join(process.cwd(), 'static'),
    prefix: '/static/',
    acceptRange: true,
    cacheControl: true,
    maxAge: '1d',
    decorateReply: false, // Избегаем конфликтов с предыдущей регистрацией
  })

  app.register(fastifySession, {
    secret: process.env.SESSION_SECRET || 'supersecret',
    saveUninitialized: false,
    cookie: {
      sameSite: 'lax',
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
    store: customRedisStore,
  })
}
