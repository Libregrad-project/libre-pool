"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const db_1 = require("../db");
class WalletService {
    async createWallet(address) {
        await db_1.db.run(`INSERT INTO wallets (address) VALUES (?)`, address);
        return this.getWallet(address);
    }
    async getWallet(address) {
        const wallet = await db_1.db.get(`SELECT * FROM wallets WHERE address = ?`, address);
        if (!wallet)
            return null;
        const payments = await db_1.db.all(`SELECT * FROM payments WHERE walletId = ? ORDER BY time DESC`, wallet.id);
        return { ...wallet, payments };
    }
    async updateWallet(address, update) {
        const wallet = await db_1.db.get(`SELECT * FROM wallets WHERE address = ?`, address);
        if (!wallet)
            return null;
        const fields = Object.keys(update);
        if (fields.length === 0)
            return wallet;
        const setString = fields.map((f) => `${f} = ?`).join(', ');
        const values = fields.map((f) => update[f]);
        values.push(address);
        await db_1.db.run(`UPDATE wallets SET ${setString}, lastSeen = CURRENT_TIMESTAMP WHERE address = ?`, ...values);
        return this.getWallet(address);
    }
    async addPayment(address, amount, txHash) {
        const wallet = await db_1.db.get(`SELECT * FROM wallets WHERE address = ?`, address);
        if (!wallet)
            throw new Error('Wallet not found');
        const result = await db_1.db.run(`INSERT INTO payments (walletId, amount, txHash) VALUES (?, ?, ?)`, wallet.id, amount, txHash);
        // Update wallet totalPaid and balance
        await this.updateWallet(address, {
            totalPaid: wallet.totalPaid + amount,
            balance: wallet.balance - amount,
        });
        // SQLite3's run() returns lastID
        const paymentId = result.lastID;
        const payment = await db_1.db.get(`SELECT * FROM payments WHERE id = ?`, paymentId);
        if (!payment)
            throw new Error('Payment insert failed');
        return payment;
    }
}
exports.WalletService = WalletService;
