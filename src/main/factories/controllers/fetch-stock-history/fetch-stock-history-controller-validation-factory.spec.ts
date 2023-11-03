import type { Validation } from '@/presentation/contracts'
import { dateFormatValidationFactory, dateRangeValidationFactory, stockSymbolValidationFactory } from '@/main/factories/validators'
import { fetchStockHistoryControllerValidationFactory } from './fetch-stock-history-controller-validation-factory'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockHistoryControllerValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockHistoryControllerValidationFactory()
    const validations: Validation[] = []
    validations.push(
      stockSymbolValidationFactory(),
      dateFormatValidationFactory(['from', 'to']),
      dateRangeValidationFactory('from', 'to')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
