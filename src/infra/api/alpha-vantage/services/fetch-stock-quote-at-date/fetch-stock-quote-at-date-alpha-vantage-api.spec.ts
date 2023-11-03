import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchStockQuoteAtDateApiData } from '@/interactions/contracts/api'
import type { DailyStockQuote } from '../../types'
import { MaximumLimitReachedError } from '../../errors/maximun-limit-reached-error'
import { FetchStockQuoteAtDateAlphaVantageApi } from './fetch-stock-quote-at-date-alpha-vantage-api'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (): string => {
  return `${baseUrl}TIME_SERIES_DAILY&symbol=any_stock_symbol&outputsize=full&apikey=${apiKey}`
}

const makeFakeFetchStockQuoteAtDateApiData = (): FetchStockQuoteAtDateApiData => ({
  stockSymbol: 'any_stock_symbol',
  quoteDate: '2023-01-02'
})

const makeFakeStockQuoteAtDate = (): StockQuoteAtDate => ({
  name: 'any_stock_symbol',
  priceAtDate: 140.50,
  quoteDate: '2023-01-02'
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

const makeSut = (): FetchStockQuoteAtDateAlphaVantageApi => {
  return new FetchStockQuoteAtDateAlphaVantageApi(apiKey)
}

let axiosMock: MockAdapter

describe('FetchStockQuoteAtDate AlphaVantageApi', () => {
  beforeAll(() => {
    axiosMock = new MockAdapter(axios)
  })

  afterEach(() => {
    axiosMock.reset()
  })

  it('Should call axios with correct url', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeDailyStockQuote())
    await sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    expect(axiosMock.history.get[0].url).toBe(makeFakeUrl())
  })

  it('Should return null if stock quote at date not found', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, null)
    const result = await sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    expect(result).toBeNull()
  })

  it('Should return null if AlphaVantage return "Time Series (Daily)" but empty', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, {
      'Time Series (Daily)': {}
    })
    const result = await sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    expect(result).toBeNull()
  })

  it('Should return null if AlphaVantage "Time Series (Daily)" not found stock quote at date', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, {
      'Time Series (Daily)': {
        '2023-01-03': {
          '1. open': '140.5000',
          '2. high': '143.1000',
          '3. low': '136.2910',
          '4. close': '141.5600',
          '5. volume': '12500'
        }
      }
    })
    const result = await sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    expect(result).toBeNull()
  })

  it('Should throw if axios throws', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(404)
    const promise = sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    await expect(promise).rejects.toThrow()
  })

  it('Should throw if AlphaVantage return Information field', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, { Information: 'any_information' })
    const promise = sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    await expect(promise).rejects.toThrow()
    await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
  })

  it('Should return a StockQuoteAtDate if fetch stock quote at date is a success', async () => {
    const sut = makeSut()
    axiosMock.onGet(makeFakeUrl()).reply(200, makeFakeDailyStockQuote())
    const result = await sut.fetchStockQuoteAtDate(makeFakeFetchStockQuoteAtDateApiData())
    expect(result).toEqual(makeFakeStockQuoteAtDate())
  })
})
