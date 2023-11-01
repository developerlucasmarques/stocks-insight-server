export class StockQuoteAtDateNotFoundError extends Error {
  constructor (stockSymbol: string, date: string) {
    super(`Stock quote with ${stockSymbol} at date ${date} not found`)
    this.name = 'StockQuoteAtDateNotFoundError'
  }
}
