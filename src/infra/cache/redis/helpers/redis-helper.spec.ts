import { Redis } from 'ioredis'
import { RedisHelper as sut } from './redis-helper'

describe('RedisHelper', () => {
  afterEach(async () => {
    await sut.disconnect()
  })

  it('Should create only once Redis instance', () => {
    const redis1 = sut.getInstance()
    const redis2 = sut.getInstance()
    expect(redis1).toBe(redis2)
  })

  it('Should connect Redis server with correct configs', () => {
    const redis = sut.getInstance()
    const config = redis.options
    expect(config.host).toBe('0.0.0.0')
    expect(config.port).toBe(6379)
    expect(config.password).toBe('')
  })

  it('Should call the connect method if the Redis instance has not yet been created', () => {
    const connectSpy = jest.spyOn(sut, 'connect')
    sut.getInstance()
    expect(connectSpy).toHaveBeenCalled()
  })

  it('Should return Redis instance', () => {
    const redis = sut.getInstance()
    expect(redis).toBeInstanceOf(Redis)
  })
})
