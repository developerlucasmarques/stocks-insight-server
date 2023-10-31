import type { Controller } from '@/presentation/contracts'
import { FetchStockHistoryController } from '@/presentation/controllers/fetch-stock-history/fetch-stock-history-controller'
import { logControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { fetchStockHistoryUseCaseFactory } from '../../usecases/fetch-stock-history-usecase-factory'
import { fetchStockHistoryValidationFactory } from './fetch-stock-history-validation'

export const fetchStockStoryControllerFactory = (): Controller => {
  const controller = new FetchStockHistoryController(
    fetchStockHistoryValidationFactory(), fetchStockHistoryUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
