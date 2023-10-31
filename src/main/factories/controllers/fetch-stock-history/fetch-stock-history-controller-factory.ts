import type { Controller } from '@/presentation/contracts'
import { FetchStockHistoryController } from '@/presentation/controllers/fetch-stock-history/fetch-stock-history-controller'
import { logControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { fetchStockHistoryUseCaseFactory } from '../../usecases/fetch-stock-history-usecase-factory'
import { stockSymbolValidationFactory } from '../../validators/stock-symbol-validation-factory'
import { fetchStockHistoryQueryValidationFactory } from './fetch-stock-history-query-validation-factory'

export const fetchStockStoryControllerFactory = (): Controller => {
  const controller = new FetchStockHistoryController(
    stockSymbolValidationFactory(),
    fetchStockHistoryQueryValidationFactory(),
    fetchStockHistoryUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
