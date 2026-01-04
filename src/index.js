import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Event: bot zalogowany
client.once(Events.ClientReady, readyClient => {
    console.log(`Zalogowano jako ${readyClient.user.tag}`);
});

// Event: obsługa wiadomości (prosta komenda tekstowa)
client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content === '!hello') {
        message.channel.send('Cześć!');
    }
});

client.login(process.env.DISCORD_API_TOKEN);