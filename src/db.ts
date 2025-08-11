import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'


export let db: Database

export async function initDB() {
  db = await open({
    filename: './data/pool.db',
    driver: sqlite3.Database,
  })

  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      address TEXT UNIQUE NOT NULL,
      balance REAL DEFAULT 0,
      pendingBalance REAL DEFAULT 0,
      totalPaid REAL DEFAULT 0,
      hashrate REAL DEFAULT 0,
      workers INTEGER DEFAULT 0,
      lastSeen TEXT DEFAULT CURRENT_TIMESTAMP,
      sharesValid INTEGER DEFAULT 0,
      sharesInvalid INTEGER DEFAULT 0,
      sharesStale INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      walletId INTEGER NOT NULL,
      amount REAL NOT NULL,
      time TEXT DEFAULT CURRENT_TIMESTAMP,
      txHash TEXT NOT NULL,
      FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE CASCADE
    );
  `)
}
