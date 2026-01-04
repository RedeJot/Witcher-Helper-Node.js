import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { env } from './src/config/env.js';

const commands = [];
const commandsPath = path.join('src', 'bot', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { data } = await import(`./src/bot/commands/${file}`);
    commands.push(data.toJSON());
};

const rest = new REST({ version:'10' }).setToken(env.token);

await rest.put(Routes.applicationGuildCommands(env.clientID, env.guildID), { body: commands });
console.log('Zajerestrowano komendy slash!');