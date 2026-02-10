import { Events, MessageFlags } from 'discord.js';

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    // 1. OBSŁUGA PRZYCISKÓW
    if (interaction.isButton()) {
      const customId = interaction.customId;

      // Sprawdzamy, czy to nasz typ przycisku
      if (customId.startsWith('rr:') || customId.startsWith('rule:')) {
        const roleId = customId.split(':')[1];
        const member = interaction.member;
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
          console.log('Nie można znaleźć roli.');
          return interaction.reply({
            content: "Role doesn't exist. | Rola nie istnieje.",
            flags: MessageFlags.Ephemeral,
          });
        }

        try {
          if (member.roles.cache.has(roleId)) {
            if (customId.startsWith('rule:')) {
              console.log(`Użytkownik @${member.user.tag} już zaakceptował zasady.`);
              return interaction.reply({
                content: 'You already accepted the rules! | Już zaakceptowałeś zasady!',
                flags: MessageFlags.Ephemeral,
              });
            } else {
              await member.roles.remove(roleId);
              console.log(`Usunięto rolę: <@&${roleId} dla @${member.user.tag}`);
              return interaction.reply({ // Użyj return, żeby nie szukać dalej komend
                content: `Removed role: <@&${roleId}> | Usunięto rolę: <@&${roleId}>.`,
                flags: MessageFlags.Ephemeral,
              });
            }
          } else {
            await member.roles.add(roleId);
            const msg = customId.startsWith('rule:')
              ? 'You accepted the rules! | Zaakceptowałeś zasady!'
              : `Role given: <@&${roleId}> | Nadano rolę: <@&${roleId}>`;
            const msgLog = customId.startsWith('rule:')
              ? `Użytkownik @${member.user.tag} zaakceptował zasady.`
              : `Nadano rolę: <@&${roleId}> dla ${member.user.tag}`;
            console.log(msgLog);

            return interaction.reply({
              content: msg,
              flags: MessageFlags.Ephemeral,
            });
          }
        } catch (err) {
            console.error(`Bot nie posiada uprawień do nadania roli`, err);
            return interaction.reply({
              content: "Bot doesn't have permissions to give role. | Bot nie posiada uprawień do nadania roli.",
              flags: MessageFlags.Ephemeral,
            });
        }
      }
      return; // Wyjdź, jeśli to był przycisk, ale nie nasz
    }

    // 2. OBSŁUGA KOMEND CZATU (Slash Commands)
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Błąd komendy ${interaction.commandName}:`, error);
        const replyOptions = {
          content: 'Error! | Wystąpił błąd!',
          flags: MessageFlags.Ephemeral,
        };
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(replyOptions);
        } else {
          await interaction.reply(replyOptions);
        }
      }
    }
  },
};
