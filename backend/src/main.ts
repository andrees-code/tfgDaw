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

  // ✅ PREFIJO GLOBAL (CLAVE)
  app.setGlobalPrefix('api')

  // 👇 RAW BODY SOLO para Stripe Webhook
  app.use(
    '/api/v1/webhooks/stripe',
    bodyParser.raw({ type: 'application/json' }),
  )

  // 👇 JSON normal para el resto
  app.use(bodyParser.json())

  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.0.14:5173',
      'https://tu-frontend.vercel.app', // 👈 añade el dominio real
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  return app
}
