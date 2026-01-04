import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';
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
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const fileUrl = pathToFileURL(filePath).href;
    const { data, execute } = await import(fileUrl);
    client.commands.set(data.name, { data, execute });
}

// Event: bot zalogowany
client.once(Events.ClientReady, readyClient => {
    console.log(`Zalogowano jako ${readyClient.user.tag}`);
});

// Event interakcji slash command
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Błąd przy wykonywaniu komendy ${interaction.commandName}:`, error);
        await interaction.reply({ content: 'Wystąpił błąd poczas wykonywania komendy:', ephemeral: true});
    }
});
// Wyeksportowanie komendy startBot i zalogowanie bota tokenem
export const startBot = () => {
    client.login(env.token);
}