import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import express, { Request, Response } from 'express'
import serverlessExpress from '@vendia/serverless-express'

let cachedServer: any  // para reutilizar serverless

// Función para crear la app Nest sobre Express
async function createNestApp(expressApp: express.Express) {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))

  app.setGlobalPrefix('api')

  // Stripe webhook necesita RAW body
  app.use('/api/v1/webhooks/stripe', bodyParser.raw({ type: 'application/json' }))

  // JSON normal para todo lo demás
  app.use(bodyParser.json())

  // Filtros y validación
  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // CORS
  app.enableCors({ origin: true, credentials: true })

  await app.init()
}

// Función que Vercel va a ejecutar
export default async function handler(req: Request, res: Response) {
  if (!cachedServer) {
    const expressApp = express()
    expressApp.use(express.json())

    await createNestApp(expressApp)

    cachedServer = serverlessExpress({ app: expressApp })
  }
  return cachedServer(req, res)
}

// Solo para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const app = express()
    await createNestApp(app)
    app.listen(3000, () => console.log('🚀 API running on http://localhost:3000'))
  })()
}
