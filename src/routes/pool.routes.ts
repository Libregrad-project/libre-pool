import { Router } from 'express'
import { PoolController } from '../controllers/pool.controller'

const router = Router()

router.get('/system/uptime', PoolController.getStats)

export default router
