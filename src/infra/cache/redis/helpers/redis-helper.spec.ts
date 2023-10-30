import { RedisHelper } from './redis-helper'

describe('RedisHelper', () => {
  beforeEach(() => {
    RedisHelper.connect()
  })

  afterEach(async () => {
    await RedisHelper.getInstance().quit()
  })

  it('Should create only once Redis instance', () => {
    const redis1 = RedisHelper.getInstance()
    const redis2 = RedisHelper.getInstance()
    expect(redis1).toBe(redis2)
  })

  it('Should connect Redis server with correct configs', () => {
    const redis = RedisHelper.getInstance()
    const config = redis.options
    expect(config.host).toBe('0.0.0.0')
    expect(config.port).toBe(6379)
    expect(config.password).toBe('')
  })
})
