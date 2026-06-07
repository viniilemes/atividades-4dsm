import dotenv from 'dotenv';
import app from './app.js';
import { initializeDatabase } from './config/initDb.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

try {
  await initializeDatabase();

  app.listen(PORT, HOST, () => {
    console.log(`App Scholar backend listening on ${HOST}:${PORT}`);
  });
} catch (error) {
  console.error('Failed to start App Scholar backend:', error);
  process.exit(1);
}
