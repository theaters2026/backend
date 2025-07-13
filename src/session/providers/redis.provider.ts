import { RedisStore } from '@mgcrea/fastify-session-redis-store'
import IORedis from 'ioredis'

export const redis = new IORedis(process.env.REDIS_URI, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 3,
})

export const redisStore = new RedisStore({ client: redis })
