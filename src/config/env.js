import 'dotenv/config';

export const env = {
  token: process.env.DISCORD_API_TOKEN,
  port: process.env.PORT ?? 3000,
  guildID: process.env.GUILD_ID,
  clientID: process.env.CLIENT_ID,
};
