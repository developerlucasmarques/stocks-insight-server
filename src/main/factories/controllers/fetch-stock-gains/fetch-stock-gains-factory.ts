import type { Controller } from '@/presentation/contracts'
import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { fetchStockGainsUseCaseFactory } from '@/main/factories/usecases/fetch-stock-gains-usecase-factory'
import { FetchStockGainsController } from '@/presentation/controllers'
import { fetchStockGainsControllerValidationFactory } from './fetch-stock-gains-controller-validation-factory'

export const fetchStockGainsControllerFactory = (): Controller => {
  const controller = new FetchStockGainsController(
    fetchStockGainsControllerValidationFactory(),
    fetchStockGainsUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
