import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';
import { pathToFileURL } from 'url';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Kolekcja komend
client.commands = new Collection();

// Dynamiczne ładowanie komend
const commandsPath = path.join('src', 'bot', 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const fileUrl = pathToFileURL(filePath).href;
  try {
    const { data, execute } = await import(fileUrl);
    client.commands.set(data.name, { data, execute });
    console.log(`Successfully loaded ${file} command.`);
  } catch (error) {
    console.error(`Error loading command ${file}:`, error);
  }
}

if (commandFiles.length > 0) {
  console.log(`Successfully loaded ${commandFiles.length} commands.`);
} else {
  console.log('No command files found to load.');
}

// Dynamiczne ładowanie eventów
const eventsPath = path.join('src', 'bot', 'events');
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const fileUrl = pathToFileURL(filePath).href;

  const event = (await import(fileUrl)).default;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Wyeksportowanie komendy startBot i zalogowanie bota tokenem
/*export const startBot = () => {
  client.login(env.token);
};*/
let isRetrying = false;

async function connectToDiscord() {
  try {
    await client.login(env.token);
    console.log('Bot połączył się z siecią.');
    isRetrying = false;
  } catch (error) {
    isRetrying = true;
    console.error('Błąd podczas połączenia do Discorda:', error);
    console.log('Ponowne połączenie za 5 sekund...');
    setTimeout(connectToDiscord, 5000);
  }
}

export const startBot = () => {
  connectToDiscord();
};

client.on('shardError', (err) => {
  isRetrying = true;
  console.error("Błąd połączenia :", err);
})

client.on('shardDisconnect', () => {
  isRetrying = true;
  console.log('Bot stracił połączenie z siecią.');
});

client.on('shardReconnecting', () => {
  console.log('Próba ponownego nawiązania połączenia...');
  isRetrying = true;
});

client.on('shardResume', () => {
  console.log('Bot ponownie połączony z siecią.');
  isRetrying = false;
});

client.on('shardReady', () => {
  if (isRetrying) {
    console.log(`Bot zalogowany ponownie i jest połączony z siecią.`);
    isRetrying = false;
  }
})

