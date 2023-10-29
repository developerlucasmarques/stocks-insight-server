import type { Router } from 'express'

export default (router: Router): void => {
  router.get('/stock/:stockSymbol/quote', (req, res) => {
    const stockSymbol = req.params.stockSymbol
    res.json({ ok: stockSymbol })
  })
}
