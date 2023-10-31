export class InvalidDateError extends Error {
  constructor (date: string) {
    super(`Date ${date} is invalid`)
    this.name = 'InvalidDateError'
  }
}
