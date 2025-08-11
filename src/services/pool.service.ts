import fs from 'fs';
import net from 'net';
import crypto from 'crypto';

const logSystem = "pool";

const connectedMiners = {};
const bannedIps = {};


export class PoolService {
  private startTime: number

  constructor() {
    this.startTime = Date.now()
  }

  getUptime(): string {
    const now = Date.now()
    const diffMs = now - this.startTime

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    const displayHours = hours % 24
    const displayMinutes = minutes % 60
    const displaySeconds = seconds % 60

    let uptimeStr = ""
    if (days > 0) uptimeStr += `${days}d`
    if (displayHours > 0) uptimeStr += `${displayHours}h`
    if (displayMinutes > 0) uptimeStr += `${displayMinutes}m`
    uptimeStr += `${displaySeconds}s`

    return uptimeStr.trim()
  }
  
  
}
