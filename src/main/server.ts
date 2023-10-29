import app from './config/app'
import env from './config/server-env'

app.listen(env.port, () => {
  console.log(`Server running at http://${env.host}:${env.port}`)
})
