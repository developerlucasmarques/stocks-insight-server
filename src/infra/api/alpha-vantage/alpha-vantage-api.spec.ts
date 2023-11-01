import type { FetchStockHistoryData } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { AlphaVantageApi } from './alpha-vantage-api'
import { MaximumLimitReachedError } from './errors/maximun-limit-reached-error'
import type { DailyStockQuote, GlobalStockQuote } from './types'
import { type StockQuote } from '@/domain/models/stock-quote'
import { type FetchStockQuoteAtDateAndLastDateApiData } from '@/interactions/contracts/api'

const apiKey = 'any_api_key'
const baseUrl = 'https://www.alphavantage.co/query?function='

const makeFakeUrl = (func: string, symbol: string, outputsize?: string): string => {
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

const makeFakeStockHistory = (): StockHistory => ({
  name: 'AAPL',
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

const makeFakeStockQuote = (): StockQuote => ({
  name: 'AAPL',
  lastPrice: 166.89,
  pricedAt: '2023-01-01'
})

const makeFakeStockQuotes = (): StockQuote[] => ([{
  name: 'AAPL',
  lastPrice: 166.89,
  pricedAt: '2023-01-01'
}, {
  name: 'TSLA',
  lastPrice: 167.09,
  pricedAt: '2023-01-01'
}])

const makeFetchStockQuoteAtDateData = (): FetchStockQuoteAtDateAndLastDateApiData => ({
  stockSymbol: 'AAPL',
  quoteAtDate: '2023-01-02'
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

const makeFakeGlobalStockQuote2 = (): GlobalStockQuote => ({
  'Global Quote': {
    '01. symbol': 'TSLA',
    '02. open': '170.3700',
    '03. high': '171.3775',
    '04. low': '165.6700',
    '05. price': '167.0900',
    '06. volume': '70625258',
    '07. latest trading day': '2023-01-01',
    '08. previous close': '171.1000',
    '09. change': '-4.2100',
    '10. change percent': '-2.4605%'
  }
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
    const stockQuoteUrl = makeFakeUrl('GLOBAL_QUOTE', 'AAPL')

    it('Should call axios with correct url', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteUrl).reply(200, makeFakeGlobalStockQuote())
      await sut.fetchStockQuote('AAPL')
      expect(axiosMock.history.get[0].url).toBe(stockQuoteUrl)
    })

    it('Should return a GlobalStockQuote if fetch stock quote is a success', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteUrl).reply(200, makeFakeGlobalStockQuote())
      const result = await sut.fetchStockQuote('AAPL')
      expect(result).toEqual(makeFakeStockQuote())
    })

    it('Should return null if stock quote not found', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteUrl).reply(200, null)
      const result = await sut.fetchStockQuote('AAPL')
      expect(result).toBeNull()
    })

    it('Should throw if axios throws', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteUrl).reply(404)
      const promise = sut.fetchStockQuote('AAPL')
      await expect(promise).rejects.toThrow()
    })

    it('Should throw if AlphaVantage return Information field', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteUrl).reply(200, { Information: 'any_information' })
      const promise = sut.fetchStockQuote('AAPL')
      await expect(promise).rejects.toThrow()
      await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
    })
  })

  describe('fetchStockHistory()', () => {
    const stockHistoryUrl = makeFakeUrl('TIME_SERIES_DAILY', 'AAPL', 'full')

    it('Should call axios with correct url', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(200, makeFakeDailyStockQuote())
      await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      expect(axiosMock.history.get[0].url).toBe(stockHistoryUrl)
    })

    it('Should return a StockHistory if fetch stock history is a success', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(200, makeFakeDailyStockQuote())
      const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      expect(result).toEqual(makeFakeStockHistory())
    })

    it('Should return null if stock history not found', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(200, null)
      const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      expect(result).toBeNull()
    })

    it('Should return null if AlphaVantage return "Time Series (Daily)" but empty', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(200, {
        'Time Series (Daily)': {}
      })
      const result = await sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      expect(result).toBeNull()
    })

    it('Should throw if axios throws', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(404)
      const promise = sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      await expect(promise).rejects.toThrow()
    })

    it('Should throw if AlphaVantage return Information field', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockHistoryUrl).reply(200, { Information: 'any_information' })
      const promise = sut.fetchStockHistory(makeFakeFetchStockHistoryData())
      await expect(promise).rejects.toThrow()
      await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
    })
  })

  describe('fetchManyStockQuotes()', () => {
    const manyStockQuotesUrl = (symbol: string): string => {
      return makeFakeUrl('GLOBAL_QUOTE', symbol)
    }

    it('Should call axios with correct url for each stock symbol received', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, makeFakeGlobalStockQuote())
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(200, makeFakeGlobalStockQuote2())
      await sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      expect(axiosMock.history.get[0].url).toBe(manyStockQuotesUrl('AAPL'))
      expect(axiosMock.history.get[1].url).toBe(manyStockQuotesUrl('TSLA'))
    })

    it('Should return StockQuote array if fetch many stock quote is a success', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, makeFakeGlobalStockQuote())
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(200, makeFakeGlobalStockQuote2())
      const result = await sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      expect(result).toEqual(makeFakeStockQuotes())
    })

    it('Should return an StockQuote if fetch many stock quote not found one stock', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, makeFakeGlobalStockQuote())
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(200, null)
      const result = await sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      expect(result).toEqual([makeFakeStockQuote()])
    })

    it('Should return empty if no stock quote found', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, null)
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(200, null)
      const result = await sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      expect(result.length).toBe(0)
    })

    it('Should throw if axios throws', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(404)
      const promise = sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      await expect(promise).rejects.toThrow()
    })

    it('Should throw if second consult axios throws', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, null)
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(404)
      const promise = sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      await expect(promise).rejects.toThrow()
    })

    it('Should throw if AlphaVantage return Information field', async () => {
      const sut = makeSut()
      axiosMock.onGet(manyStockQuotesUrl('AAPL')).reply(200, { Information: 'any_information' })
      axiosMock.onGet(manyStockQuotesUrl('TSLA')).reply(200, null)
      const promise = sut.fetchManyStockQuotes(['AAPL', 'TSLA'])
      await expect(promise).rejects.toThrow()
      await expect(promise).rejects.toBeInstanceOf(MaximumLimitReachedError)
    })
  })

  describe('fetchStockQuoteAtDate()', () => {
    const stockQuoteAtDateUrl = makeFakeUrl('TIME_SERIES_DAILY', 'AAPL', 'full')

    it('Should call axios with correct url', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteAtDateUrl).reply(200, makeFakeDailyStockQuote())
      await sut.fetchStockQuoteAtDate(makeFetchStockQuoteAtDateData())
      expect(axiosMock.history.get[0].url).toBe(stockQuoteAtDateUrl)
    })

    it('Should return null if stock quote at date not found', async () => {
      const sut = makeSut()
      axiosMock.onGet(stockQuoteAtDateUrl).reply(200, null)
      const result = await sut.fetchStockQuoteAtDate(makeFetchStockQuoteAtDateData())
      expect(result).toBeNull()
    })
  })
})
