import { Request, Response } from 'express'
import { WalletService } from '../services/wallet.service'

const walletService = new WalletService()

export class WalletController {
  static async createWallet(req: Request, res: Response) {
    const { address } = req.body
    if (!address) {
      return res.status(400).json({ error: 'Address is required' })
    }

    try {
      const existing = await walletService.getWallet(address)
      if (existing) return res.status(200).json(existing)

      const wallet = await walletService.createWallet(address)
      return res.status(201).json(wallet)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  static async getWallet(req: Request, res: Response) {
    const address = req.params.address
    try {
      const wallet = await walletService.getWallet(address)
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' })

      return res.json(wallet)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }

  static async updateWallet(req: Request, res: Response) {
    const address = req.params.address
    const update = req.body

    try {
      const wallet = await walletService.updateWallet(address, update)
      if (!wallet) return res.status(404).json({ error: 'Wallet not found' })

      return res.json(wallet)
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }



   static async getTotalMiners(req: Request, res: Response) {
    try {
      const totalMiners = await walletService.getTotalMiners()
      return res.json({ totalMiners })
    } catch (err: any) {
      return res.status(500).json({ error: err.message })
    }
  }




  static async addPayment(req: Request, res: Response) {
    const address = req.params.address
    const { amount, txHash } = req.body

    if (typeof amount !== 'number' || !txHash) {
      return res.status(400).json({ error: 'Amount (number) and txHash are required' })
    }

    try {
      const payment = await walletService.addPayment(address, amount, txHash)
      return res.status(201).json(payment)
    } catch (err: any) {
      if (err.message === 'Wallet not found') {
        return res.status(404).json({ error: err.message })
      }
      return res.status(500).json({ error: err.message })
    }
  }
}
