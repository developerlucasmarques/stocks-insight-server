import type { StockQuote } from '@/domain/models/stock-quote'
import type { GlobalStockQuote } from '../../types'
import { MaximumLimitReachedError } from '../../errors/maximun-limit-reached-error'
import { FetchStockQuoteAlphaVantageApi } from './fetch-stock-quote-alpha-vantage-api'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (): string => {
  return `${baseUrl}GLOBAL_QUOTE&symbol=any_stock_symbol&apikey=${apiKey}`
}

const makeFakeStockQuote = (): StockQuote => ({
  name: 'any_stock_symbol',
  lastPrice: 166.89,
  pricedAt: '2023-01-01'
})

const makeFakeGlobalStockQuote = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'any_stock_symbol',
    '02. open': '170.3700',
    '03. high': '171.3775',
    '04. low': '165.6700',
    '05. price': '166.8900',
    '06. volume': '70625258',
    '07. latest trading day': '2023-01-01',
    '08. previous close': '171.1000',
    '09. change': '-4.2100',
    '10. change percent': '-2.4605%'
  }
})

const makeSut = (): FetchStockQuoteAlphaVantageApi => {
  return new FetchStockQuoteAlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('FetchStockQuote AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeGlobalStockQuote())
    await sut.fetchStockQuote('any_stock_symbol')
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })

  it('Should return a GlobalStockQuote if fetch stock quote is a success', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeGlobalStockQuote())
    const result = await sut.fetchStockQuote('any_stock_symbol')
    expect(result).toEqual(makeFakeStockQuote())
  })

  it('Should return null if stock quote not found', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, null)
    const result = await sut.fetchStockQuote('any_stock_symbol')
    expect(result).toBeNull()
  })

  it('Should throw if axios throws', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(404)
    const promise = sut.fetchStockQuote('any_stock_symbol')
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if AlphaVantage return Information field', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, { Information: 'any_information' })
    const promise = sut.fetchStockQuote('any_stock_symbol')
    await expect(promise).rejects.toThrow()
    await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
  })
})
