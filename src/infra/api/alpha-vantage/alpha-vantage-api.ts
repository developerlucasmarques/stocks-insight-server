import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api/fetch-stock-quote-by-symbol-api'
import axios from 'axios'
import type { GlobalStockQuote } from './types/global-stock-quote'

export class AlphaVantageApi implements FetchStockQuoteBySymbolApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='
  constructor (private readonly apiKey: string) {}

  async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const url = this.baseUrl + `GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${this.apiKey}`
    const response = await axios.get(url)
    const data: GlobalStockQuote = response.data
    return {
      name: data['Global Quote']['01. symbol'],
      lastPrice: Number(Number(data['Global Quote']['05. price']).toFixed(2)),
      pricedAt: data['Global Quote']['07. latest trading day']
    }
  }
}
