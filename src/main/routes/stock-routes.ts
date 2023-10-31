import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { fetchStockQuoteControllerFactory } from '../factories/controllers/fetch-stock-quote/fetch-stock-quote-controller-factory'
import { fetchStockStoryControllerFactory } from '../factories/controllers/fetch-stock-history/fetch-stock-history-controller-factory'

export default (router: Router): void => {
  router.get(
    '/stock/:stockSymbol/quote', adaptRoute(fetchStockQuoteControllerFactory())
  )
  router.get(
    '/stocks/:stockSymbol/history', adaptRoute(fetchStockStoryControllerFactory())
  )
}
