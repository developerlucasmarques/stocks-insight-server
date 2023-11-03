import type { Controller } from '@/presentation/contracts'
import { logControllerDecoratorFactory } from '@/main/factories/decorators/log-controller-decorator-factory'
import { FetchStockComparisonController } from '@/presentation/controllers'
import { fetchStockComparasionUseCaseFactory } from '../../usecases'
import { fetchStockComparisonControllerValidationFactory } from './fetch-stock-comparison-controller-validation-factory'

export const fetchStockComparisonControllerFactory = (): Controller => {
  const controller = new FetchStockComparisonController(
    fetchStockComparisonControllerValidationFactory(),
    fetchStockComparasionUseCaseFactory()
  )
  return logControllerDecoratorFactory(controller)
}
