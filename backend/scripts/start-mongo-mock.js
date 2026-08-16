import { MongoMemoryServer } from 'mongodb-memory-server';
import net from 'net';

// Helper to check if a port is in use
const isPortInUse = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer()
      .once('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .once('listening', () => {
        server.close();
        resolve(false);
      })
      .listen(port);
  });
};

async function start() {
  const port = 27017;
  const portInUse = await isPortInUse(port);
  
  if (portInUse) {
    console.log(`[Mock DB] Port ${port} is already in use. Assuming MongoDB is running.`);
    process.exit(0);
  }

  try {
    console.log('[Mock DB] Starting in-memory MongoDB server...');
    const mongod = await MongoMemoryServer.create({
      instance: {
        port: port,
        dbName: 'recipebox',
        storageEngine: 'ephemeralForTest'
      }
    });

    const uri = mongod.getUri();
    console.log(`[Mock DB] In-memory MongoDB server started at: ${uri}`);
    console.log('[Mock DB] Keep this process running for local database access.');
    
    // Prevent process from exiting
    const interval = setInterval(() => {}, 1000);

    const shutdown = async () => {
      console.log('[Mock DB] Stopping in-memory MongoDB server...');
      clearInterval(interval);
      await mongod.stop();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[Mock DB] Failed to start in-memory MongoDB server:', error);
    process.exit(1);
  }
}

start();
