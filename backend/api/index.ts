// api/index.ts
import { Handler } from 'aws-lambda'
import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { createApp } from '../dist/main'

let cachedServer: Handler

async function bootstrap() {
  const expressApp = express()
  expressApp.use(express.json())

  await createApp(expressApp)

  return serverlessExpress({ app: expressApp })
}

export const handler: Handler = async (event, context, callback) => {
  if (!cachedServer) {
    cachedServer = await bootstrap()
  }
  return cachedServer(event, context, callback)
}
