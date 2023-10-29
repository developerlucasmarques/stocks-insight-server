import type { Controller } from '@/presentation/contracts'
import { FetchStockQuoteController } from '@/presentation/controllers/fetch-stock-quote-controller'
import { stockSymbolValidationFactory } from '../validators/stock-symbol-validation-factory'
import { fetchStockQuoteUseCaseFactory } from '../usecases/fetch-stock-quote-usecase-factory'

export const fetchStockQuoteControllerFactory = (): Controller => {
  return new FetchStockQuoteController(
    stockSymbolValidationFactory(), fetchStockQuoteUseCaseFactory()
  )
}
