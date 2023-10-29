import { Router, type Express } from 'express'
import { readdirSync } from 'fs'
import * as path from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use(router)
  readdirSync(path.join(__dirname, '..', 'routes')).map(async file => {
    if (!file.includes('.test.')) {
      (await import (`../routes/${file}`)).default(router)
    }
  })
}
