import { badRequest, notFound, ok, serverError } from '@/presentation/helpers/http/http-helper'
import { left, right, type Either } from '@/shared/either'
import type { Validation } from '../../contracts'
import type { HttpRequest } from '../../http-types/http'
import { FetchStockHistoryController } from './fetch-stock-history-controller'
import type { FetchStockHistory, FetchStockHistoryData, FetchStockHistoryResponse } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import { StockHistoryNotFoundError } from '@/domain/errors'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol'
  },
  query: {
    from: '2023-01-02',
    to: '2023-01-03'
  }
})

const makeFakeFetchStockHistoryData = (): FetchStockHistoryData => ({
  stockSymbol: 'any_stock_symbol',
  initialDate: '2023-01-02',
  finalDate: '2023-01-03'
})

const makeFakeStockHistory = (): StockHistory => ({
  name: 'any_stock_symbol',
  prices: [{
    opening: 139.09,
    low: 138.29,
    high: 141.10,
    closing: 140.50,
    pricedAt: '2023-01-02',
    volume: 9200
  }, {
    opening: 140.50,
    low: 136.29,
    high: 143.10,
    closing: 141.56,
    pricedAt: '2023-01-03',
    volume: 12500
  }]
})

const makeParamsValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ValidationStub()
}

const makeFetchStockHistory = (): FetchStockHistory => {
  class FetchStockHistoryStub implements FetchStockHistory {
    async perform (data: FetchStockHistoryData): Promise<FetchStockHistoryResponse> {
      return await Promise.resolve(right(makeFakeStockHistory()))
    }
  }
  return new FetchStockHistoryStub()
}

type SutTypes = {
  sut: FetchStockHistoryController
  paramsValidationStub: Validation
  fetchStockHistoryStub: FetchStockHistory
}

const makeSut = (): SutTypes => {
  const paramsValidationStub = makeParamsValidation()
  const fetchStockHistoryStub = makeFetchStockHistory()
  const sut = new FetchStockHistoryController(paramsValidationStub, fetchStockHistoryStub)
  return { sut, paramsValidationStub, fetchStockHistoryStub }
}

describe('FetchStockHistory Controller', () => {
  it('Should call Validation with correct value', async () => {
    const { sut, paramsValidationStub } = makeSut()
    const validateSpy = jest.spyOn(paramsValidationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(makeFakeRequest().params)
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, paramsValidationStub } = makeSut()
    jest.spyOn(paramsValidationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, paramsValidationStub } = makeSut()
    jest.spyOn(paramsValidationStub, 'validate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call FetchStockHistory with correct values', async () => {
    const { sut, fetchStockHistoryStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockHistoryStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith(makeFakeFetchStockHistoryData())
  })

  it('Should return 404 if FetchStockHistory returns StockHistoryNotFoundError', async () => {
    const { sut, fetchStockHistoryStub } = makeSut()
    jest.spyOn(fetchStockHistoryStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new StockHistoryNotFoundError(makeFakeFetchStockHistoryData())))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new StockHistoryNotFoundError(makeFakeFetchStockHistoryData())))
  })

  it('Should return 500 if FetchStockHistory throws', async () => {
    const { sut, fetchStockHistoryStub } = makeSut()
    jest.spyOn(fetchStockHistoryStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if FetchStockHistory is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeStockHistory()))
  })
})
