import 'dotenv/config';

import app from './app.js';
import { testConnection } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
    process.exit(1);
  }
}

startServer();
