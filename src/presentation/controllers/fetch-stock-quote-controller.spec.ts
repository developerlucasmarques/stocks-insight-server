import { type Either, right, left } from '@/shared/either'
import type { Validation } from '../contracts/validation'
import type { HttpRequest } from '../http-types/http'
import { FetchStockQuoteController } from './fetch-stock-quote-controller'
import { badRequest, notFound, ok, serverError } from '../helpers/http/http-helper'
import type { FetchStockQuote, FetchStockQuoteResponse } from '@/domain/contracts'
import type { StockQuote } from '@/domain/models/stock-quote'
import { StockQuoteNotFoundError } from '@/domain/errors'

const makeFakeRequest = (): HttpRequest => ({
  params: {
    stockSymbol: 'any_stock_symbol'
  }
})

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_name',
  lastPrice: 120.99,
  pricedAt: 'any_priced_at'
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    async validate (input: any): Promise<Either<Error, null>> {
      return await Promise.resolve(right(null))
    }
  }
  return new ValidationStub()
}

const makeFetchStockQuote = (): FetchStockQuote => {
  class FetchStockQuoteStub implements FetchStockQuote {
    async perform (stockSymbol: string): Promise<FetchStockQuoteResponse> {
      return await Promise.resolve(right(makeFakeStockQuote()))
    }
  }
  return new FetchStockQuoteStub()
}

type SutTypes = {
  sut: FetchStockQuoteController
  validationStub: Validation
  fetchStockQuoteStub: FetchStockQuote
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const fetchStockQuoteStub = makeFetchStockQuote()
  const sut = new FetchStockQuoteController(validationStub, fetchStockQuoteStub)
  return { sut, validationStub, fetchStockQuoteStub }
}

describe('FetchStockQuote Controller', () => {
  it('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith({ stockSymbol: 'any_stock_symbol' })
  })

  it('Should return 400 if Validation fails', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      Promise.resolve(left(new Error('any_message')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('any_message')))
  })

  it('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should call FetchStockQuote with correct stock symbol', async () => {
    const { sut, fetchStockQuoteStub } = makeSut()
    const performSpy = jest.spyOn(fetchStockQuoteStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_stock_symbol')
  })

  it('Should return 404 if FetchStockQuote returns StockQuoteNotFoundError', async () => {
    const { sut, fetchStockQuoteStub } = makeSut()
    jest.spyOn(fetchStockQuoteStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new StockQuoteNotFoundError('any_stock_symbol')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new StockQuoteNotFoundError('any_stock_symbol')))
  })

  it('Should return 500 if FetchStockQuote throws', async () => {
    const { sut, fetchStockQuoteStub } = makeSut()
    jest.spyOn(fetchStockQuoteStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 200 if FetchStockQuote is a success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeStockQuote()))
  })
})
