import { EodhdApi } from '@/infra/api/eodhd/eodhd-api'
import env from '@/main/config/env'

export const eodhdApiFactory = (): EodhdApi => {
  return new EodhdApi(env.eodhdApiToken)
}
