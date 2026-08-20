import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'

import menuRoutes from './routes/menu'
import { errorHandler } from './middlewares/error-handler'

const HOST = process.env.HOST || 'https://localhost'
const PORT = process.env.PORT || 8000
const MONGO_URL = process.env.MONGO_URL

if (!MONGO_URL) throw new Error('MONGO_URL is not defined in environment variables')

const LOGMSG = '⚡️[Paketá Credito Live-Coding BoilerPlate]:'

mongoose.connect(MONGO_URL, {}, err => {
  const msg = err
    ? `${LOGMSG} Failed to connect to MongoDB: ${err}`
    : `${LOGMSG} MongoDB connection established successfully`
  console.log(msg)
})

const app = express()
app.use(express.json())

app.use('/api/v1/menu', menuRoutes)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`${LOGMSG} Server is running at ${HOST}:${PORT}`)
})
