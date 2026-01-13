import { Handler } from 'aws-lambda'
import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { createApp } from '../src/main'

let cachedServer: Handler

async function bootstrap() {
  const expressApp = express()

  // 👇 JSON base (IMPORTANTE en serverless)
  expressApp.use(express.json())

  // 👇 reutilizamos TODA la config real de Nest
  await createApp(expressApp)

  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (event, context, callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrap()
  }
  return cachedServer(event, context, callback)
}
