export class InvalidPurchasedAmountError extends Error {
  constructor () {
    super('Purchased amount is invalid')
    this.name = 'InvalidPurchasedAmountError'
  }
}
