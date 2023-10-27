export class StockQuoteNotFoundError extends Error {
  constructor (stockSymbol: string) {
    super(`Stock quote with ${stockSymbol} not found`)
    this.name = 'StockQuoteNotFoundError'
  }
}
