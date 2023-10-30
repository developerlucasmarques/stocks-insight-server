import { LogMongoRepo } from '@/infra/db/mongodb/log/log-mongo-repo'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import type { Controller } from '@/presentation/contracts'

export const logControllerDecoratorFactory = (controller: Controller): Controller => {
  const logMongoRepo = new LogMongoRepo()
  return new LogControllerDecorator(controller, logMongoRepo)
}
