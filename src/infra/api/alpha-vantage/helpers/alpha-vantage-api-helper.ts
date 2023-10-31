import type { StockQuote } from '@/domain/models/stock-quote'
import type { GlobalStockQuote } from '../types/global-stock-quote'
import type { StockHistory } from '@/domain/models/stock-history'
import type { DailyStockQuote } from '../types/daily-stock-quote'
import type { FetchStockHistoryData } from '@/domain/contracts'

export class AlphaVantageApiHelper {
  static formatStockQuote (data: GlobalStockQuote): StockQuote {
    return {
      name: data['Global Quote']['01. symbol'],
      lastPrice: Number(Number(data['Global Quote']['05. price']).toFixed(2)),
      pricedAt: data['Global Quote']['07. latest trading day']
    }
  }

  static formatStockHistory (dailyStock: DailyStockQuote, data: FetchStockHistoryData): StockHistory {
    const timeSeries = dailyStock['Time Series (Daily)']
    const filteredData: Record<string, any> = {}
    for (const date in timeSeries) {
      if (date >= data.initialDate && date <= data.finalDate) {
        filteredData[date] = timeSeries[date]
      }
    }
    const stockHistory: StockHistory = {
      name: data.stockSymbol,
      prices: Object.entries(filteredData).map(([date, dataValue]) => ({
        opening: Number(parseFloat(dataValue['1. open']).toFixed(2)),
        low: Number(parseFloat(dataValue['3. low']).toFixed(2)),
        high: Number(parseFloat(dataValue['2. high']).toFixed(2)),
        closing: Number(parseFloat(dataValue['4. close']).toFixed(2)),
        pricedAt: date,
        volume: Number(parseInt(dataValue['5. volume']).toFixed(2))
      }))
    }
    return stockHistory
  }
}
