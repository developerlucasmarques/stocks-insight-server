export class NoStockQuoteFoundError extends Error {
  constructor () {
    super('Unable to find any quote')
    this.name = 'NoStockQuoteFoundError'
  }
}
