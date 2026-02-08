import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { client } from '../client.js';

export async function sendReactionRoleMessage({
  guildId,
  channelId,
  message,
  buttons,
}) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  const STYLE_MAP = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
  };

  const rows = [];
  let row = new ActionRowBuilder();

  buttons.forEach((btn, index) => {
    const button = new ButtonBuilder()
      .setCustomId(`rr:${btn.roleId}`)
      .setLabel(btn.label)
      .setStyle(STYLE_MAP[btn.buttonType] ?? ButtonStyle.Secondary);

    if (btn.emoji) {
      button.setEmoji(btn.emoji);
    }

    row.addComponents(button);

    if ((index + 1) % 5 === 0) {
      rows.push(row);
      row = new ActionRowBuilder();
    }
  });

  if (row.components.length) rows.push(row);

  const sentMessage = await channel.send({
    content: message.content,
    components: rows,
  });
  return { messageId: sentMessage.id };
}
