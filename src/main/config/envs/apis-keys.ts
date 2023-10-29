import dotenv from 'dotenv'

dotenv.config()

export default {
  alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY ?? '',
  eodhdApiToken: process.env.EODHD_API_TOKEN ?? ''
}
