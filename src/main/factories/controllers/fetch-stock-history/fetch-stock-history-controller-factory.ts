import type { Controller } from '@/presentation/contracts'
import { FetchStockHistoryController } from '@/presentation/controllers/fetch-stock-history/fetch-stock-history-controller'
import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { fetchStockHistoryUseCaseFactory } from '@/main/factories/usecases'
import { stockSymbolValidationFactory } from '@/main/factories/validators'
import { fetchStockHistoryQueryValidationFactory } from './fetch-stock-history-query-validation-factory'

export const fetchStockStoryControllerFactory = (): Controller => {
  const controller = new FetchStockHistoryController(
    stockSymbolValidationFactory(),
    fetchStockHistoryQueryValidationFactory(),
    fetchStockHistoryUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
