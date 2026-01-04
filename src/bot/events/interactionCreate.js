import { Events, MessageFlags } from "discord.js";


export default {
    name: Events.InteractionCreate,

    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName,
        );
        if(!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Błąd przy wykonywaniu komendy ${interaction.commandName}:`, error);
        
            
            const replyOptions = {
                    content: 'Wystąpił błąd podczas wykonywania komendy!',
                    flags: MessageFlags.Ephemeral,
                };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(replyOptions);
            } else {
                await interaction.reply(replyOptions);
            }
        }
    }
}

