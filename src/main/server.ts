import 'module-alias/register'
import { RedisHelper } from '@/infra/cache/redis/helpers/redis-helper'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from './config/app'
import mongodbEnv from './config/envs/mongodb-env'
import env from './config/envs/server-env'
import { addAllStockSymbolsUseCaseFactory } from './factories/usecases/add-all-stock-symbols-usecase-factory'

RedisHelper.connect()
const addAllStockSymbolsUseCase = addAllStockSymbolsUseCaseFactory()

MongoHelper.connect(mongodbEnv.mongoUrl)
  .then(async () => {
    await addAllStockSymbolsUseCase.perform()
    app.listen(env.port, () => {
      console.log(`Server running at http://${env.host}:${env.port}`)
    })
  })
  .catch(console.error)
