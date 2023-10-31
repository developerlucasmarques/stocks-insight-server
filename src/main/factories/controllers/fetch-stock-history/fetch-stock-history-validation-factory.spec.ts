import type { Validation } from '@/presentation/contracts'
import { stockSymbolValidationFactory } from '../../validators/stock-symbol-validation-factory'
import { ValidationComposite } from '@/presentation/helpers/validators/composite/validation-composite'
import { fetchStockHistoryValidationFactory } from './fetch-stock-history-validation'
import { dateFormatValidationFactory } from '../../validators/date-format-validation-factory'
import { dateRangeValidationFactory } from '../../validators/date-range-validation-factory'

jest.mock('@/presentation/helpers/validators/composite/validation-composite')

describe('FetchStockHistoryValidation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    fetchStockHistoryValidationFactory()
    const validations: Validation[] = []
    validations.push(
      stockSymbolValidationFactory(),
      dateFormatValidationFactory(['from', 'to']),
      dateRangeValidationFactory('from', 'to')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
