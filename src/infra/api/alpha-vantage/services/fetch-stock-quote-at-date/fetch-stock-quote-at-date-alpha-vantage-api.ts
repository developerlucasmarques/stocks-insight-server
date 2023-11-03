import type { StockQuoteAtDate } from '@/domain/models/stock-quote-at-date'
import type { FetchStockQuoteAtDateApi, FetchStockQuoteAtDateApiData } from '@/interactions/contracts/api'
import type { DailyStockQuote } from '../../types'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class FetchStockQuoteAtDateAlphaVantageApi implements FetchStockQuoteAtDateApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (symbol: string): string {
    return `${this.baseUrl}TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKey}`
  }

  async fetchStockQuoteAtDate (data: FetchStockQuoteAtDateApiData): Promise<null | StockQuoteAtDate> {
    const response = await axios.get(this.makeUrl(data.stockSymbol))
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
