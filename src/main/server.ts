import 'module-alias/register'
import app from './config/app'
import env from './config/envs/server-env'

app.listen(env.port, () => {
  console.log(`Server running at http://${env.host}:${env.port}`)
})
