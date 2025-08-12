import app from './app';
import { initDB } from './db';

import { TcpServerService } from './services/tcp.service'

const tcpServer = new TcpServerService(3333, 3334)
//tcpServer.start()

const port = 4000;


async function main() {
  await initDB()
  tcpServer.start()
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`)
  })
}

main()
