import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api'
import type { GlobalStockQuote } from '../../types'
import { AlphaVantageApiHelper } from '../../helpers/alpha-vantage-api-helper'
import axios from 'axios'

export class FetchStockQuoteAlphaVantageApi implements FetchStockQuoteBySymbolApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='

  constructor (private readonly apiKey: string) {}

  private makeUrl (symbol: string): string {
    return `${this.baseUrl}GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
  }

  async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const response = await axios.get(this.makeUrl(stockSymbol))
    if (!AlphaVantageApiHelper.dataExist(response.data)) {
      return null
    }
    AlphaVantageApiHelper.reachedTheLimit(response.data)
    const data: GlobalStockQuote = response.data
    return AlphaVantageApiHelper.formatStockQuote(data)
  }
}
