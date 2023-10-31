import type { Controller } from '@/presentation/contracts'
import { FetchStockQuoteController } from '@/presentation/controllers'
import { stockSymbolValidationFactory } from '../../validators'
import { fetchStockQuoteUseCaseFactory } from '../../usecases'
import { logControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'

export const fetchStockQuoteControllerFactory = (): Controller => {
  const controller = new FetchStockQuoteController(
    stockSymbolValidationFactory(), fetchStockQuoteUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
