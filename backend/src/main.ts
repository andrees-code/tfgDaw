// src/main.ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import express from 'express'

export async function createApp(expressApp?: express.Express) {
  const app = expressApp
    ? await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
    : await NestFactory.create(AppModule)

  // 🔑 PREFIJO GLOBAL (imprescindible)
  app.setGlobalPrefix('api')

  // 🔔 Stripe webhook necesita RAW body
  app.use(
    '/api/v1/webhooks/stripe',
    bodyParser.raw({ type: 'application/json' }),
  )

  // 🧾 JSON normal para el resto
  app.use(bodyParser.json())

  // 🚨 Filtro global
  app.useGlobalFilters(new AllExceptionsFilter())

  // ✅ Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // 🌍 CORS (abre en prod + dev)
  app.enableCors({
    origin: true, // ← en Vercel es lo más seguro
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  return app
}

/**
 * SOLO PARA DESARROLLO LOCAL
 * Vercel NO ejecuta esto
 */
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await createApp()
    await app.listen(3000)
    console.log('🚀 API running on http://localhost:3000')
  }
  bootstrap()
}
