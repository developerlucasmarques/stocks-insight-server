import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchStockQuoteAtDateApi, FetchStockQuoteAtDateApiData } from '@/interactions/contracts/api'
import type { DailyStockQuote } from '../../types'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class FetchStockQuoteAtDateAlphaVantageApi implements FetchStockQuoteAtDateApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (func: string, symbol: string, outputsize?: string): string {
    if (outputsize) {
      return `${this.baseUrl}${func}&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`
    }
    return `${this.baseUrl}${func}&symbol=${symbol}&apikey=${this.apiKey}`
  }

  async fetchStockQuoteAtDate (data: FetchStockQuoteAtDateApiData): Promise<null | StockQuoteAtDate> {
    const url = this.makeUrl('TIME_SERIES_DAILY', data.stockSymbol, 'full')
    const response = await axios.get(url)
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    if (!response.data?.['Time Series (Daily)'][data.quoteDate]) {
      return null
    }
    const dailyStock: DailyStockQuote = response.data
    return AlphaVantageApiHelper.formatStockQuoteAtDate(dailyStock, data)
  }
}
