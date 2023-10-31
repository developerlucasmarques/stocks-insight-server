import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { fetchStockQuoteControllerFactory, fetchStockStoryControllerFactory } from '../factories/controllers'

export default (router: Router): void => {
  router.get(
    '/stock/:stockSymbol/quote', adaptRoute(fetchStockQuoteControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/history', adaptRoute(fetchStockStoryControllerFactory())
  )
}
