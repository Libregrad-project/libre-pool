import net from 'net'

export class TcpServerService {
  private server: net.Server | null = null
  private server_diff_100: net.Server | null = null
  private port: number
  private diff_100_port: number
  private activeSockets: Set<net.Socket> = new Set()
  private activeSocketsDiff100: Set<net.Socket> = new Set()
  private isShuttingDown = false

  constructor(port: number, diff100_port: number) {
    this.port = port
    this.diff_100_port = diff100_port
  }

  private createHandler(socketSet: Set<net.Socket>) {
    return (socket: net.Socket) => {
      if (this.isShuttingDown) {
        socket.destroy(new Error('Server is shutting down'))
        return
      }

      socketSet.add(socket)
      console.log(`New connection from`, socket.remoteAddress, socket.remotePort)
      
      socket.on('data', (data) => {
        console.log("Received data:", data.toString())
        socket.write('ACK\n')
      })
      
      socket.on('error', (err) => {
        console.error('Socket error:', err)
        socketSet.delete(socket)
      })
      
      socket.on('close', () => {
        console.log('Connection closed:', socket.remoteAddress, socket.remotePort)
        socketSet.delete(socket)
      })
    }
  }

  start() {
    this.isShuttingDown = false
    
    // Create main server
    this.server = net.createServer(this.createHandler(this.activeSockets))
    
    this.server.listen(this.port, () => {
      console.log(`TCP Server listening on port ${this.port}`)
    })
    
    this.server.on('error', (err) => {
      console.error('Server Error:', err)
    })

    // Create diff_100 server
    this.server_diff_100 = net.createServer(this.createHandler(this.activeSocketsDiff100))
    
    this.server_diff_100.listen(this.diff_100_port, () => {
      console.log(`TCP Server (diff_100) listening on port ${this.diff_100_port}`)
    })
    
    this.server_diff_100.on('error', (err) => {
      console.error('Server (diff_100) Error:', err)
    })
  }

  stop() {
    if (this.isShuttingDown) return
    this.isShuttingDown = true

    console.log('Initiating graceful shutdown...')
    
    // Stop accepting new connections
    if (this.server) {
      this.server.close(() => {
        console.log(`Main server stopped accepting connections`)
      })
    }
    
    if (this.server_diff_100) {
      this.server_diff_100.close(() => {
        console.log(`Diff_100 server stopped accepting connections`)
      })
    }

    // Gracefully close active connections
    this.closeActiveSockets(this.activeSockets, 'main')
    this.closeActiveSockets(this.activeSocketsDiff100, 'diff_100')
  }

  private closeActiveSockets(socketSet: Set<net.Socket>, serverName: string) {
    if (socketSet.size === 0) {
      console.log(`No active connections on ${serverName} server`)
      return
    }

    console.log(`Closing ${socketSet.size} active connections on ${serverName} server...`)
    
    // First, try to close connections gracefully
    socketSet.forEach(socket => {
      socket.end() // Sends FIN packet to close writing side
    })

    // Force close any remaining connections after timeout
    const forceCloseTimeout = setTimeout(() => {
      if (socketSet.size > 0) {
        console.log(`Force closing ${socketSet.size} remaining connections on ${serverName} server`)
        socketSet.forEach(socket => {
          socket.destroy(new Error('Server shutdown timeout'))
        })
        socketSet.clear()
      }
    }, 5000) // 5 second grace period

    // Clean up timeout if all sockets close naturally
    const checkInterval = setInterval(() => {
      if (socketSet.size === 0) {
        clearTimeout(forceCloseTimeout)
        clearInterval(checkInterval)
        console.log(`All connections closed on ${serverName} server`)
      }
    }, 100)
  }
}
