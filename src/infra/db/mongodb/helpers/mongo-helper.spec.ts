import { Collection } from 'mongodb'
import { MongoHelper as sut } from './mongo-helper'

let anyCollection: Collection

describe('Mongo Helper', () => {
  afterEach(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if MongoDB is down', async () => {
    anyCollection = await sut.getCollection('any')
    expect(anyCollection).toBeInstanceOf(Collection)
    await sut.disconnect()
    anyCollection = await sut.getCollection('any')
    expect(anyCollection).toBeInstanceOf(Collection)
  })

  it('Should set a default URI when uri is undefined', async () => {
    const uri = undefined
    await sut.connect(uri)
    const currentUri = sut.getUri()
    expect(currentUri).toBe('mongodb://127.0.0.1:27017/stocks-insight')
  })
})
