import express from 'express'
import cors from 'cors'
import walletRoutes from './routes/wallet.routes'

const app = express()

const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'], // frontend URLs allowed to access API
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // if you want to allow cookies or auth headers
}

app.use(cors())
app.use(express.json())
app.use('/api', walletRoutes)

export default app
