import type { StockQuote } from '@/domain/models/stock-quote'
import type { GlobalStockQuote } from '../types/global-stock-quote'

export class AlphaVantageApiHelper {
  static formatStockQuote (data: GlobalStockQuote): StockQuote {
    return {
      name: data['Global Quote']['01. symbol'],
      lastPrice: Number(Number(data['Global Quote']['05. price']).toFixed(2)),
      pricedAt: data['Global Quote']['07. latest trading day']
    }
  }
}
