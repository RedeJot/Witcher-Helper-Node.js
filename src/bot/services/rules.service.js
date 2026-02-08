import { client } from '../client.js';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

function splitMessagne(text, limit = 2000) {
  const chunks = [];
  let current = text;

  while (current.length > 0) {
    if (current.length <= limit) {
      chunks.push(current);
      break;
    }

    let splitAt = current.lastIndexOf('\n', limit);
    if (splitAt === -1) splitAt = current.lastIndexOf(' ', limit);
    if (splitAt === -1) splitAt = limit;

    chunks.push(current.substring(0, splitAt).trim());
    current = current.substring(splitAt).trim();
  }
  return chunks;
}

export async function sendRulesMessage({ guildId, channelId, message, button, buttonChecked}) {
  const guild =
    await client.guilds.fetch(guildId);
  const channel =
    await guild.channels.fetch(
      channelId,
    );

  const fetched = await channel.messages.fetch({ limit: 10 });
  if (fetched.size > 0) {
    try {
      await channel.bulkDelete(fetched, true);
      const remaining = await channel.messages.fetch({ limit: 10 });
      if (remaining.size > 0) {
        for (const msg of remaining.values()) {
          await msg.delete();
        }
      }
    } catch (error) {
      console.error('Error deleting messages:', error);
    }
  }

  const chunks = splitMessagne(message.content);

  for (let i = 0; i < chunks.length -1; i++) {
    await channel.send({ content: chunks[i] });
  }

  const lastChunk = chunks[chunks.length - 1];
  const messageOptions = { content: lastChunk };

  if (buttonChecked) {
    const acceptButton =
      new ButtonBuilder()
        .setCustomId(`rule:${button.roleId}`)
        .setLabel('Accept Rules/Zaakceptuj zasady')
        .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(acceptButton);
    messageOptions.components = [row];
  }

  const sentMessage = await channel.send(messageOptions);

  return { messageId: sentMessage.id };
}


