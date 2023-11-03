import type { FetchStockHistoryData } from '@/domain/contracts'
import type { StockHistory } from '@/domain/models/stock-history'
import type { FetchStockHistoryApi } from '@/interactions/contracts/api'
import type { DailyStockQuote } from '../../types'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class FetchStockHistoryAlphaVantageApi implements FetchStockHistoryApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (symbol: string): string {
    return `${this.baseUrl}TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${this.apiKey}`
  }

  async fetchStockHistory (data: FetchStockHistoryData): Promise<null | StockHistory> {
    const response = await axios.get(this.makeUrl(data.stockSymbol))
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    if (!AlphaVantageApiHelper.existInData(response.data, 'Time Series (Daily)')) {
      return null
    }
    const dailyStock: DailyStockQuote = response.data
    return AlphaVantageApiHelper.formatStockHistory(dailyStock, data)
  }
}
