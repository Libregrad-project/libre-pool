export interface ShareStats {
  valid: number;
  invalid: number;
  stale: number;
}

export interface Payment {
  amount: number;
  time: string;
  txHash: string;
}

export interface Wallet {
  address: string;
  balance: number;
  pendingBalance: number;
  totalPaid: number;
  hashrate: number;
  workers: number;
  lastSeen: string;
  shares: ShareStats;
  payments: Payment[];
}
