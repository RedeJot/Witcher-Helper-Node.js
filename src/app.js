import { startBot } from './bot/client.js';
import { startApi } from './api/server.js';

process.on('unhandledRejection', (error) => {
  console.error('Nieobsłużone odrzucenie Promise:', error);
});

process.on('uncaughtException', (error) => {
  console.error('Nieprzechwycony wyjątek aplikacji:', error);
  process.exit(1);
});

await startBot();
await startApi();
