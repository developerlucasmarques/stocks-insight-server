export class InvalidDateFormatError extends Error {
  constructor (date: string) {
    super(`Date ${date} is invalid format`)
    this.name = 'InvalidDateFormatError'
  }
}
