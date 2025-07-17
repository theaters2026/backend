import IORedis from 'ioredis'
import { Logger } from '@nestjs/common'

const redisUri = process.env.REDIS_URI || 'redis://localhost:6379'
const logger = new Logger('Redis')

export const redis = new IORedis(redisUri, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 3,
})

redis.on('error', (err) => {
  logger.error('Redis connection error:', err)
})

redis.on('connect', () => {
  logger.log('Redis connected successfully!')
})

redis.on('pong', (message) => {
  logger.log('Redis pong response:', message)
})

redis.on('monitor', (time, args) => {
  logger.log('Redis command:', time, args)
})

export const customRedisStore = {
  async get(sid: string, callback: (err?: any, session?: any) => void) {
    try {
      const data = await redis.get(`session:${sid}`)
      if (!data) return callback()

      const session = JSON.parse(data)
      callback(null, session)
    } catch (error) {
      logger.error('Error getting session from Redis:', error)
      callback(error)
    }
  },

  async set(sid: string, session: any, callback: (err?: any) => void) {
    try {
      const ttl =
        session.cookie && session.cookie.maxAge
          ? Math.floor(session.cookie.maxAge / 1000)
          : 24 * 60 * 60

      await redis.set(`session:${sid}`, JSON.stringify(session), 'EX', ttl)
      callback()
    } catch (error) {
      logger.error('Error setting session in Redis:', error)
      callback(error)
    }
  },

  async destroy(sid: string, callback: (err?: any) => void) {
    try {
      await redis.del(`session:${sid}`)
      callback()
    } catch (error) {
      logger.error('Error destroying session in Redis:', error)
      callback(error)
    }
  },
}
