import { Events, MessageFlags } from 'discord.js';

export default {
  name: Events.InteractionCreate,

  async execute(interaction) {
    // Event nasłuchujący przyciski
    if (!interaction.isButton()) return;

    const customId = interaction.customId;

    if (!customId.startsWith('rr:')) return;

    const roleId = customId.split(':')[1];

    const member = interaction.member;
    const role = interaction.guild.roles.cache.get(roleId);

    if (!role) {
      return interaction.reply({
        content: 'Rola nie istnieje',
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      if (member.roles.cache.has(roleId)) {
        await member.roles.remove(roleId);
        await interaction.reply({
          content: `Usunięto role ${role.name}`,
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await member.roles.add(roleId);
        await interaction.reply({
          content: `Nadano role ${role.name}`,
          flags: MessageFlags.Ephemeral,
        });
      }
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: 'Bot nie ma uprawień do nadania roli',
        flags: MessageFlags.Ephemeral,
      });
    }

    // Event nasłuchujący komendy
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(
        `Błąd przy wykonywaniu komendy ${interaction.commandName}:`,
        error,
      );

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
  },
};
