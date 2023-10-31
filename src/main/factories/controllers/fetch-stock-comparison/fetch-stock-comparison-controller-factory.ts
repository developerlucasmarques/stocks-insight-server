import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { stockSymbolValidationFactory, stockToCompareValidationFactory } from '@/main/factories/validators'
import type { Controller } from '@/presentation/contracts'
import { FetchStockComparisonController } from '@/presentation/controllers'
import { fetchStockComparasionUseCaseFactory } from '../../usecases'

export const fetchStockComparisonControllerFactory = (): Controller => {
  const controller = new FetchStockComparisonController(
    stockSymbolValidationFactory(),
    stockToCompareValidationFactory(),
    fetchStockComparasionUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
