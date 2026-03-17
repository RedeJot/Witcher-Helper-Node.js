import { Events, AttachmentBuilder, MessageFlags } from 'discord.js';

const cooldowns = new Set();

export default {
  name: Events.MessageCreate,

  async execute(message) {
    if (message.author.bot || message.system) return;

    const botMention = new RegExp(`^<@!?${message.client.user.id}>$`);

    if (botMention.test(message.content)) {
      if (cooldowns.has(message.author.id)) {
        return message.reply({
          content: `**Please wait before pinging cat! We don't want the cat to startle. | Proszę poczekaj zanim oznaczysz kota! Nie chcemy żeby kot się spłoszył.**`,
          flags: MessageFlags.Ephemeral,
        });
      }
      try {

        cooldowns.add(message.author.id);

        const respone = await fetch('https://api.thecatapi.com/v1/images/search', {
          headers: {
            'x-api-key': process.env.CAT_API_KEY,
          },
        });

        const data = await respone.json();
        const imageUrl = data[0]?.url;
        const attachment = new AttachmentBuilder(imageUrl, { name: 'cat.png' });



        await message.reply({
          content: '# Meow! 🐱',
          files: [attachment],
        });
      } catch (error) {
        console.error('Error responding to mention:', error);
      } finally {
        setTimeout(() => cooldowns.delete(message.author.id), 5000); // 5 sekund cooldown
      }
    }
    },
  }