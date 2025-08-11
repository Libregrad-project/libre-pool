"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = require("../services/wallet.service");
const walletService = new wallet_service_1.WalletService();
class WalletController {
    static async createWallet(req, res) {
        const { address } = req.body;
        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }
        try {
            const existing = await walletService.getWallet(address);
            if (existing)
                return res.status(200).json(existing);
            const wallet = await walletService.createWallet(address);
            return res.status(201).json(wallet);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    static async getWallet(req, res) {
        const address = req.params.address;
        try {
            const wallet = await walletService.getWallet(address);
            if (!wallet)
                return res.status(404).json({ error: 'Wallet not found' });
            return res.json(wallet);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    static async updateWallet(req, res) {
        const address = req.params.address;
        const update = req.body;
        try {
            const wallet = await walletService.updateWallet(address, update);
            if (!wallet)
                return res.status(404).json({ error: 'Wallet not found' });
            return res.json(wallet);
        }
        catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
    static async addPayment(req, res) {
        const address = req.params.address;
        const { amount, txHash } = req.body;
        if (typeof amount !== 'number' || !txHash) {
            return res.status(400).json({ error: 'Amount (number) and txHash are required' });
        }
        try {
            const payment = await walletService.addPayment(address, amount, txHash);
            return res.status(201).json(payment);
        }
        catch (err) {
            if (err.message === 'Wallet not found') {
                return res.status(404).json({ error: err.message });
            }
            return res.status(500).json({ error: err.message });
        }
    }
}
exports.WalletController = WalletController;
