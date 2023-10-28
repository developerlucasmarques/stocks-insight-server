import type { FetchAllSymbolsOfListedStocksApi } from '@/interactions/contracts/api/fetch-all-symbols-of-listed-stocks-api'
import axios from 'axios'

export class EodhdApi implements FetchAllSymbolsOfListedStocksApi {
  private readonly baseUrl = 'https://eodhd.com/api/exchange-symbol-list/NASDAQ?api_token='

  constructor (private readonly apiToken: string) {}

  async fetchAll (): Promise<string[]> {
    const url = this.baseUrl + this.apiToken
    const response = await axios.get(url)
    if (!response.data) return []
    const lines = response.data.split('\n')
    const stockCodes: string[] = []
    for (const line of lines) {
      stockCodes.push(line.split(',')[0])
    }
    stockCodes.shift(); stockCodes.pop()
    return stockCodes
  }
}
