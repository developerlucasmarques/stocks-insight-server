import type { FetchStockHistoryData } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import type { DailyStockQuote } from '../../types'
import { MaximumLimitReachedError } from '../../errors/maximun-limit-reached-error'
import { FetchStockHistoryAlphaVantageApi } from './fetch-stock-history-alpha-vantage-api'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (): string => {
  return `${baseUrl}TIME_SERIES_DAILY&symbol=any_stock_symbol&outputsize=full&apikey=${apiKey}`
}

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

const makeFakeDailyStockQuote = (): DailyStockQuote => ({
  'Time Series (Daily)': {
    '2023-01-02': {
      '1. open': '139.0900',
      '2. high': '141.1000',
      '3. low': '138.2910',
      '4. close': '140.5000',
      '5. volume': '9200'
    },
    '2023-01-03': {
      '1. open': '140.5000',
      '2. high': '143.1000',
      '3. low': '136.2910',
      '4. close': '141.5600',
      '5. volume': '12500'
    }
  }
})

const makeSut = (): FetchStockHistoryAlphaVantageApi => {
  return new FetchStockHistoryAlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('FetchStockHistory AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeDailyStockQuote())
    await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })

  it('Should return a StockHistory if fetch stock history is a success', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeDailyStockQuote())
    const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    expect(result).toEqual(makeFakeStockHistory())
  })

  it('Should return null if stock history not found', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, null)
    const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    expect(result).toBeNull()
  })

  it('Should return null if AlphaVantage return "Time Series (Daily)" but empty', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, {
      'Time Series (Daily)': {}
    })
    const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    expect(result).toBeNull()
  })

  it('Should throw if axios throws', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(404)
    const promise = sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if AlphaVantage return Information field', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, { Information: 'any_information' })
    const promise = sut.fetchStockHistory(makeFakeFetchStockHistoryData())
    await expect(promise).rejects.toThrow()
    await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
  })
})
