import { Redis } from 'ioredis'
import env from '@/main/config/redis-env'

export class RedisHelper {
  private static cli: Redis | null

  static connect (): void {
    if (!RedisHelper.cli) {
      this.cli = new Redis({
        host: env.host,
        port: Number(env.port),
        password: env.password
      })
    }
  }

  static getInstance (): Redis {
    if (!this.cli) {
      RedisHelper.connect()
      return this.cli as unknown as Redis
    }
    return this.cli
  }
}
