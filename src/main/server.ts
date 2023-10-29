import express from 'express'
import env from './config/server-env'

const app = express()
app.listen(env.port, () => {
  console.log(`Server running at http://${env.host}:${env.port}`)
})
