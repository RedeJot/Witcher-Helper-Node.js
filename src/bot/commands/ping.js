import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Sprawdza czy bot odpowiada');


export async function execute(interaction) {
    // wysyła wiadomość na komende /ping
    await interaction.reply('Pong!');
};