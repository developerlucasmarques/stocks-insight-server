import 'module-alias/register'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'
import { addAllStockSymbolsUseCaseFactory } from './factories/usecases/add-all-stock-symbols-usecase-factory'

RedisHelper.connect()
const addAllStockSymbolsUseCase = addAllStockSymbolsUseCaseFactory()

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    await addAllStockSymbolsUseCase.perform()
    app.listen(env.serverPort, () => {
      console.log(`Server running at http://${env.serverHost}:${env.serverPort}`)
    })
  })
  .catch(console.error)
