import type { Controller } from '@/presentation/contracts'
import { FetchStockHistoryController } from '@/presentation/controllers/fetch-stock-history/fetch-stock-history-controller'
import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { fetchStockHistoryControllerValidationFactory } from './fetch-stock-history-controller-validation-factory'
import { fetchStockHistoryUseCaseFactory } from '@/main/factories/usecases'

export const fetchStockStoryControllerFactory = (): Controller => {
  const controller = new FetchStockHistoryController(
    fetchStockHistoryControllerValidationFactory(),
    fetchStockHistoryUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
