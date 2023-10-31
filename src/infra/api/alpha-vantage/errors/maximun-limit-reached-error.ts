export class MaximumLimitReachedError extends Error {
  constructor (data: string) {
    super('Maximum request limit reached')
    this.stack = data
    this.name = 'MaximumLimitEeachedError'
  }
}
