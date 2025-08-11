import { Router } from 'express'
import { WalletController } from '../controllers/wallet.controller'

const router = Router()

router.post('/wallet', WalletController.createWallet)
router.get('/wallet/:address', WalletController.getWallet)
router.put('/wallet/:address', WalletController.updateWallet)

// Endpoint to add payment for a wallet
router.post('/wallet/:address/payment', WalletController.addPayment)

export default router
