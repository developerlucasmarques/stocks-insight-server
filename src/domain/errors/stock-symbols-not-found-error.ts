export class StockSymbolsNotFoundError extends Error {
  constructor () {
    super('Stock symbols not found')
    this.name = 'StockSymbolsNotFoundError'
  }
}
