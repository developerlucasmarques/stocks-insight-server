import dotenv from 'dotenv'

dotenv.config()

export default {
  password: process.env.REDIS_PASSWORD ?? '',
  port: process.env.REDIS_PORT ?? '6379',
  host: process.env.REDIS_HOST ?? '0.0.0.0'
}
