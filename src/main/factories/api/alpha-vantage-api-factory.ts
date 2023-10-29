import { AlphaVantageApi } from '@/infra/api/alpha-vantage/alpha-vantage-api'
import env from '@/main/config/envs/apis-keys'

export const alphaVantageApiFactory = (): AlphaVantageApi => {
  return new AlphaVantageApi(env.alphaVantageApiKey)
}
