import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import express, { Request, Response } from 'express'

let cachedApp: express.Express | null = null

async function createNestApp(): Promise<express.Express> {
  if (cachedApp) return cachedApp

  const expressApp = express()

  // Nest sobre Express
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
  app.setGlobalPrefix('api')

  app.use('/api/v1/webhooks/stripe', bodyParser.raw({ type: 'application/json' }))
  app.use(bodyParser.json())

  app.useGlobalFilters(new AllExceptionsFilter())
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  // ✅ CORS restringido a orígenes conocidos (configurable vía CORS_ORIGINS)
  const defaultOrigins = [
    'https://www.ponteaprobados.es',
    'https://ponteaprobados.es',
    'http://localhost:5173',
    'http://localhost:4173',
  ]
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : defaultOrigins

  app.enableCors({
    origin: (origin, callback) => {
      // Permitimos peticiones sin origin (curl, apps móviles, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`))
    },
    credentials: true,
  })

  await app.init()
  cachedApp = expressApp
  return expressApp
}

// Esta es la función que Vercel ejecuta
export default async function handler(req: Request, res: Response) {
  const app = await createNestApp()
  app(req, res)
}

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const app = await createNestApp()
    app.listen(3000, () => console.log('🚀 API running on http://localhost:3000'))
  })()
}
