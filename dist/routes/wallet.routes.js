"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wallet_controller_1 = require("../controllers/wallet.controller");
const router = (0, express_1.Router)();
router.post('/wallet', wallet_controller_1.WalletController.createWallet);
router.get('/wallet/:address', wallet_controller_1.WalletController.getWallet);
router.put('/wallet/:address', wallet_controller_1.WalletController.updateWallet);
// Endpoint to add payment for a wallet
router.post('/wallet/:address/payment', wallet_controller_1.WalletController.addPayment);
exports.default = router;
