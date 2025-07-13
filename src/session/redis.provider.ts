import IORedis from 'ioredis'

const redisUri = process.env.REDIS_URI
const defaultTtl = process.env.SESSION_TTL ? parseInt(process.env.SESSION_TTL, 10) : 24 * 60 * 60

export const redis = new IORedis(redisUri, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: 3,
})

redis.on('error', (err) => {
  console.error('Redis error:', err)
})

redis.on('connect', () => {
  console.log('Redis connection successful!')
})

export const customRedisStore = {
  async get(sid: string, callback: (err?: any, session?: any) => void) {
    try {
      const data = await redis.get(`session:${sid}`)
      if (!data) return callback()

      const session = JSON.parse(data)
      callback(null, session)
    } catch (error) {
      callback(error)
    }
  },

  async set(sid: string, session: any, callback: (err?: any) => void) {
    try {
      const ttl = session.cookie?.maxAge ? Math.floor(session.cookie.maxAge / 1000) : defaultTtl

      await redis.setex(`session:${sid}`, ttl, JSON.stringify(session))
      callback()
    } catch (error) {
      callback(error)
    }
  },

  async destroy(sid: string, callback: (err?: any) => void) {
    try {
      await redis.del(`session:${sid}`)
      callback()
    } catch (error) {
      callback(error)
    }
  },
}
