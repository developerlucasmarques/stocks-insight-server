import type { StockQuote } from '@/domain/models/stock-quote'
import type { FetchStockQuoteBySymbolApi } from '@/interactions/contracts/api/fetch-stock-quote-by-symbol-api'
import axios from 'axios'

export class AlphaVantageApi implements FetchStockQuoteBySymbolApi {
  private readonly baseUrl = 'https://www.alphavantage.co/query?function='
  constructor (private readonly apiKey: string) {}

  async fetchStockQuote (stockSymbol: string): Promise<null | StockQuote > {
    const url = this.baseUrl + `GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${this.apiKey}`
    await axios.get(url)
    return null
  }
}
