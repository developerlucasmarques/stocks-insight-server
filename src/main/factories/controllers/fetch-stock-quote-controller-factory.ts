import type { Controller } from '@/presentation/contracts'
import { FetchStockQuoteController } from '@/presentation/controllers/fetch-stock-quote-controller'
import { stockSymbolValidationFactory } from '../validators/stock-symbol-validation-factory'
import { fetchStockQuoteUseCaseFactory } from '../usecases/fetch-stock-quote-usecase-factory'
import { logControllerDecoratorFactory } from '../decorators/log-controller-decorator-factory'

export const fetchStockQuoteControllerFactory = (): Controller => {
  const controller = new FetchStockQuoteController(
    stockSymbolValidationFactory(), fetchStockQuoteUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
