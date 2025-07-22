export const REDIS_URI = process.env.REDIS_URI || 'redis://localhost:6379'
export const REDIS_CONNECT_TIMEOUT = 5000
export const REDIS_MAX_RETRIES = 3
export const DEFAULT_SESSION_TTL_SECONDS = 24 * 60 * 60
export const SESSION_PREFIX = 'session:'
