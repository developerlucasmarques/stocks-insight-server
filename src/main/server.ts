import 'module-alias/register'
import app from './config/app'
import env from './config/envs/server-env'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { addAllStockSymbolsUseCaseFactory } from './factories/usecases/add-all-stock-symbols-usecase-factory'

RedisHelper.connect()
const addAllStockSymbolsUseCase = addAllStockSymbolsUseCaseFactory()

addAllStockSymbolsUseCase.perform()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running at http://${env.host}:${env.port}`)
    })
  })
  .catch(console.error)
