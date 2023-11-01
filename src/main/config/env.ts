import dotenv from 'dotenv'

dotenv.config()

export default {
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY ?? '',
  eodhdApiToken: process.env.EODHD_API_TOKEN ?? '',

  mongoUrl: process.env.MONGO_URL ?? '',

  redisPassword: process.env.REDIS_PASSWORD ?? '',
  redisPort: process.env.REDIS_PORT ?? '6379',
  redisHost: process.env.REDIS_HOST ?? '0.0.0.0',

  serverPort: process.env.SERVER_PORT ?? '5050',
  serverHost: process.env.SERVER_HOST ?? 'localhost'
}
