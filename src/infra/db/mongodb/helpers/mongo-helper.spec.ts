import { Collection } from 'mongodb'
import { MongoHelper as sut } from './mongo-helper'
import env from '@/main/config/envs/mongodb-env'

describe('Mongo Helper', () => {
  beforeEach(async () => {
    await sut.connect(env.mongoUrl)
  })

  afterEach(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if MongoDB is down', async () => {
    let anyCollection = await sut.getCollection('any')
    expect(anyCollection).toBeInstanceOf(Collection)
    await sut.disconnect()
    anyCollection = await sut.getCollection('any')
    expect(anyCollection).toBeInstanceOf(Collection)
  })
})
