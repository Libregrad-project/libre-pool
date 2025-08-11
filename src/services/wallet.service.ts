import { db } from '../db'

export interface Wallet {
  id: number
  address: string
  balance: number
  pendingBalance: number
  totalPaid: number
  hashrate: number
  workers: number
  lastSeen: string
  sharesValid: number
  sharesInvalid: number
  sharesStale: number
}

export interface Payment {
  id: number
  walletId: number
  amount: number
  time: string
  txHash: string
}

export class WalletService {
  async createWallet(address: string): Promise<Wallet> {
    await db.run(
      `INSERT INTO wallets (address) VALUES (?)`,
      address
    )
    return this.getWallet(address) as Promise<Wallet>
  }

  async getWallet(address: string): Promise<(Wallet & { payments: Payment[] }) | null> {
    const wallet = await db.get<Wallet>(
      `SELECT * FROM wallets WHERE address = ?`,
      address
    )
    if (!wallet) return null

    const payments = await db.all<Payment[]>(
      `SELECT * FROM payments WHERE walletId = ? ORDER BY time DESC`,
      wallet.id
    )

    return { ...wallet, payments }
  }

  async updateWallet(address: string, update: Partial<Omit<Wallet, 'id' | 'address'>>): Promise<Wallet | null> {
    const wallet = await db.get<Wallet>(`SELECT * FROM wallets WHERE address = ?`, address)
    if (!wallet) return null

    const fields = Object.keys(update)
    if (fields.length === 0) return wallet

    const setString = fields.map((f) => `${f} = ?`).join(', ')
    const values = fields.map((f) => (update as any)[f])
    values.push(address)

    await db.run(
      `UPDATE wallets SET ${setString}, lastSeen = CURRENT_TIMESTAMP WHERE address = ?`,
      ...values
    )

    return this.getWallet(address) as Promise<Wallet>
  }

  async addPayment(address: string, amount: number, txHash: string): Promise<Payment> {
    const wallet = await db.get<Wallet>(`SELECT * FROM wallets WHERE address = ?`, address)
    if (!wallet) throw new Error('Wallet not found')

    const result = await db.run(
      `INSERT INTO payments (walletId, amount, txHash) VALUES (?, ?, ?)`,
      wallet.id,
      amount,
      txHash
    )

    // Update wallet totalPaid and balance
    await this.updateWallet(address, {
      totalPaid: wallet.totalPaid + amount,
      balance: wallet.balance - amount,
    })

    // SQLite3's run() returns lastID
    const paymentId = result.lastID
    const payment = await db.get<Payment>(`SELECT * FROM payments WHERE id = ?`, paymentId)
    if (!payment) throw new Error('Payment insert failed')

    return payment
  }
}
