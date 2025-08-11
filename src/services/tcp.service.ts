import net from 'net'

export class TcpServerService {
  private server: net.Server | null = null
  private port: number
  private diff: number

  constructor(port: number) {
    this.port = port
  }

  start() {
    this.server = net.createServer((socket) => {
      console.log(`New connection from`, socket.remoteAddress, socket.remotePort)

      socket.on(`data`, (data) => {
        console.log("Recieved data:", data.toString())

        // Todo: Parse the miner data here, e.g. Stratum
        // For now, just echo back.
        socket.write('ACK\n')
      })

      socket.on(`error`, (err) => {
        console.error('Socket error:', err)
      })

      socket.on('close', () => {
        console.log('Connection closed:', socket.remoteAddress, socket.remotePort)
      })
      
    })

    this.server.listen(this.port, () => {
      console.log(`TCP Server listening on port ${this.port}`)
    })

    this.server.on(`error`, (err) => {
      console.error('Server Error:', err)
    })
  }

  stop() {
    if (this.server) {
      this.server.close(() => {
        console.log(`TCP server stopped`)
      })
    }
  }
}
