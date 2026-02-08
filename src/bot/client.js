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
    console.log(`Successfully loaded ${commandFiles.length} commands.`);
  } catch (error) {
    console.error(`Error loading command ${file}:`, error);
  }

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
export const startBot = () => {
  client.login(env.token);
};
