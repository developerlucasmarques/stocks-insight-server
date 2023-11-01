import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { fetchStockGainsUseCaseFactory } from '@/main/factories/usecases/fetch-stock-gains-usecase-factory'
import type { Controller } from '@/presentation/contracts'
import { FetchStockGainsController } from '@/presentation/controllers'
import { dateFormatValidationFactory, stockSymbolValidationFactory } from '../../validators'

export const fetchStockGainsControllerFactory = (): Controller => {
  const controller = new FetchStockGainsController(
    stockSymbolValidationFactory(),
    dateFormatValidationFactory(['purchasedAt']),
    fetchStockGainsUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
