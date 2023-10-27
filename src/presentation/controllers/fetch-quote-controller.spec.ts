import { type Either, right, left } from '@/shared/either'
import type { Validation } from '../contracts/validation'
import type { HttpRequest } from '../http-types/http'
import { FetchQuoteController } from './fetch-quote-controller'
import { badRequest, notFound, serverError } from '../helpers/http-helper'
import type { FetchQuote, FetchQuoteResponse } from '@/domain/contracts/fetch-quote'
import type { StockQuote } from '@/domain/models/stock-quote'
import { StockQuoteNotFoundError } from '@/domain/errors/sotck-quote-not-found-error'

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

const makeFetchQuote = (): FetchQuote => {
  class FetchQuoteStub implements FetchQuote {
    async perform (stockSymbol: string): Promise<FetchQuoteResponse> {
      return await Promise.resolve(right(makeFakeStockQuote()))
    }
  }
  return new FetchQuoteStub()
}

type SutTypes = {
  sut: FetchQuoteController
  validationStub: Validation
  fetchQuoteStub: FetchQuote
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const fetchQuoteStub = makeFetchQuote()
  const sut = new FetchQuoteController(validationStub, fetchQuoteStub)
  return { sut, validationStub, fetchQuoteStub }
}

describe('FetchQuote Controller', () => {
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

  it('Should call FetchQuote with correct stock symbol', async () => {
    const { sut, fetchQuoteStub } = makeSut()
    const performSpy = jest.spyOn(fetchQuoteStub, 'perform')
    await sut.handle(makeFakeRequest())
    expect(performSpy).toHaveBeenCalledWith('any_stock_symbol')
  })

  it('Should return 404 if FetchQuote returns StockQuoteNotFoundError', async () => {
    const { sut, fetchQuoteStub } = makeSut()
    jest.spyOn(fetchQuoteStub, 'perform').mockReturnValueOnce(
      Promise.resolve(left(new StockQuoteNotFoundError('any_stock_symbol')))
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(notFound(new StockQuoteNotFoundError('any_stock_symbol')))
  })

  it('Should return 500 if FetchQuote throws', async () => {
    const { sut, fetchQuoteStub } = makeSut()
    jest.spyOn(fetchQuoteStub, 'perform').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
