import type { Controller } from '@/presentation/contracts'
import { FetchStockGainsController } from '@/presentation/controllers'
import { fetchStockGainsValidationFactory } from './fetch-stock-gains-validation-factory'
import { fetchStockGainsUseCaseFactory } from '@/main/factories/usecases/fetch-stock-gains-usecase-factory'
import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'

export const fetchStockGainsControllerFactory = (): Controller => {
  const controller = new FetchStockGainsController(
    fetchStockGainsValidationFactory(), fetchStockGainsUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
