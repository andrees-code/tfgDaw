import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { AllExceptionsFilter } from './all-exceptions.filter'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as bodyParser from 'body-parser'
import express from 'express'

export async function createApp(expressApp: express.Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  )

  app.setGlobalPrefix('api')

  app.use(
    '/api/v1/webhooks/stripe',
    bodyParser.raw({ type: 'application/json' }),
  )

  app.use(bodyParser.json())

  app.useGlobalFilters(new AllExceptionsFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  app.enableCors({
    origin: true,
    credentials: true,
  })

  await app.init()
}
