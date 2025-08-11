import app from './app';
import { initDB } from './db';

const port = 4000;

async function main() {
  await initDB()
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`)
  })
}

main()
