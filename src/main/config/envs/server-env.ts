import dotenv from 'dotenv'

dotenv.config()

export default {
  port: process.env.SERVER_PORT ?? '5050',
  host: process.env.SERVER_HOST ?? 'localhost'
}
