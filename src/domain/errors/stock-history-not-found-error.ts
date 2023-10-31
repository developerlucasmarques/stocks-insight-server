import type { FetchStockHistoryData } from '../contracts/fetch-stock-history'

export class StockHistoryNotFoundError extends Error {
  constructor (data: FetchStockHistoryData) {
    super(
      `${data.stockSymbol} stock history with start data ${data.initialDate} and end date ${data.finalDate} not found`
    )
    this.name = 'StockHistoryNotFoundError'
  }
}
