export class InvalidDateRangeError extends Error {
  constructor () {
    super('Start date cannot be greater than end date')
    this.name = 'InvalidDateRangeError'
  }
}
