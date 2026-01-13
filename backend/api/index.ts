import serverlessExpress from '@vendia/serverless-express'
import express from 'express'
import { createApp } from './main'

let server: any

async function bootstrap() {
  const expressApp = express()
  expressApp.use(express.json())

  await createApp(expressApp)

  return serverlessExpress({ app: expressApp })
}

export default async function handler(req: any, res: any) {
  if (!server) {
    server = await bootstrap()
  }
  return server(req, res)
}
