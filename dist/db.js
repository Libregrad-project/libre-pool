"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
exports.initDB = initDB;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
async function initDB() {
    exports.db = await (0, sqlite_1.open)({
        filename: './data/pool.db',
        driver: sqlite3_1.default.Database,
    });
    await exports.db.exec(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        address TEXT UNIQUE NOT NULL,
        balance REAL DEFAULT 0,
        pendingBalance REAL DEFAULT 0,
        totalPaid REAL DEFAULT 0,
        hashrate REAL DEFAULT 0,
        workers INTEGER DEFAULT 0,
        lastSeen TEXT DEFAULT 0,
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
        FOREIGN KEY (walletId) REFERENCES wallets(id) ON DEFAULT CASCADE
      );
      
    `);
}
