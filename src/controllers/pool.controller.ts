import { Request, Response } from 'express'
import { PoolService } from '../services/pool.service'

const poolService = new PoolService()

export class PoolController {
  static async getStats(req: Request, res: Response) {
    try {
      const uptime = poolService.getUptime()

      return res.json({
        uptime
      })
    } catch (err: any) {
      return res.status(500).json({ error: err.message})
    }
  }
}
