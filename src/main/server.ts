import 'module-alias/register'
import app from './config/app'
import env from './config/envs/server-env'
import { addAllStockSymbolsUseCaseFactory } from './factories/usecases/add-all-stock-symbols-usecase-factory'

addAllStockSymbolsUseCaseFactory()

app.listen(env.port, () => {
  console.log(`Server running at http://${env.host}:${env.port}`)
})
