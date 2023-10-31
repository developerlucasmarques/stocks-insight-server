import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AlphaVantageApi } from './alpha-vantage-api'
import { MaximumLimitReachedError } from './errors/maximun-limit-reached-error'
import type { GlobalStockQuote } from './types/global-stock-quote'
import type { DailyStockQuote } from './types/daily-stock-quote'
import type { FetchStockHistoryData } from '@/domain/contracts'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='
const symbol = 'AAPL'

const makeFakeUrl = (func: string, outputsize?: string): string => {
  if (outputsize) {
    return `${baseUrl}${func}&symbol=${symbol}&outputsize=${outputsize}&apikey=${apiKey}`
  }
  return `${baseUrl}${func}&symbol=${symbol}&apikey=${apiKey}`
}

const makeFakeFetchStockHistoryData = (): FetchStockHistoryData => ({
  stockSymbol: 'AAPL',
  initialDate: '2023-01-02',
  finalDate: '2023-01-03'
})

const makeFakeGlobalStockQuote = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'AAPL',
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

const makeFakeDailyStockQuote = (): DailyStockQuote => ({
  '2023-01-01': {
    '1. open': '172.0200',
    '2. high': '173.0700',
    '3. low': '170.3410',
    '4. close': '171.2100',
    '5. volume': '51861083'
  }
})

const makeSut = (): AlphaVantageApi => {
  return new AlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  describe('fetchStockQuote()', () => {
    it('Should call axios with correct url', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('GLOBAL_QUOTE')).reply(200, makeFakeGlobalStockQuote())
      await sut.fetchStockQuote('AAPL')
      expect(axiosMock.history.get[0].url).toBe(makeFakeUrl('GLOBAL_QUOTE'))
    })

    it('Should return a GlobalStockQuote if fetch stock quote is a success', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('GLOBAL_QUOTE')).reply(200, makeFakeGlobalStockQuote())
      const result = await sut.fetchStockQuote('AAPL')
      expect(result).toEqual({
        name: 'AAPL',
        lastPrice: 166.89,
        pricedAt: '2023-01-01'
      })
    })

    it('Should return null if stock quote not found', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('GLOBAL_QUOTE')).reply(200, null)
      const result = await sut.fetchStockQuote('AAPL')
      expect(result).toBeNull()
    })

    it('Should throw if axios throws', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('GLOBAL_QUOTE')).reply(404)
      const promise = sut.fetchStockQuote('AAPL')
      await expect(promise).rejects.toThrow()
    })

    it('Should throw if AlphaVantage return Information field', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('GLOBAL_QUOTE')).reply(200, { Information: 'any_information' })
      const promise = sut.fetchStockQuote('AAPL')
      await expect(promise).rejects.toThrow()
      await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
    })
  })

  describe('fetchStockHistory()', () => {
    it('Should call axios with correct url', async () => {
      const sut = makeSut()
      axiosMock.onGet(makeFakeUrl('TIME_SERIES_DAILY', 'full')).reply(200, makeFakeDailyStockQuote())
      await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      expect(axiosMock.history.get[0].url).toBe(makeFakeUrl('TIME_SERIES_DAILY', 'full'))
    })
  })
})
