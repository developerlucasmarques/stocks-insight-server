export class AllStockSymbolsNotFoundError extends Error {
  constructor () {
    super('Stock symbols not found')
    this.name = 'StockSymbolsNotFoundError'
    this.stack = 'Not found stock symbols in Api'
  }
}
