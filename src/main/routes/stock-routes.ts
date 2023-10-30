import type { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { fetchStockQuoteControllerFactory } from '../factories/controllers/fetch-stock-quote-controller-factory'

export default (router: Router): void => {
  router.get(
    '/stock/:stockSymbol/quote', adaptRoute(fetchStockQuoteControllerFactory())
  )
}
