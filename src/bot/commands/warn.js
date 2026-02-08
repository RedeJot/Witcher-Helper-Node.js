import { SlashCommandBuilder, PermissionFlagsBits} from 'discord.js';
import { addWarning } from '../services/warn.service.js';

export const data = new SlashCommandBuilder()
  .setName('warn')
  .setDescription(
    'Dodaje ostrzeżenie użytkownikowi w wybranym języku Przykład /warn "Użytkownik" "Powód" "PL/EN"',
  )
  .addUserOption((option) =>
    option
      .setName('uzytkownik')
      .setDescription('Wpisz użytkownika do ostrzeżenia!')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('powod')
      .setDescription('Podaj powód ostrzeżenia!')
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName('jezyk')
      .setDescription('Ustawia język wiadomości.')
      .setRequired(false)
      .addChoices(
        { name: 'Polski', value: 'pl' },
        { name: 'Angielski', value: 'en' },
      ),
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers);

export async function execute(interaction) {
  const member = interaction.options.getMember('uzytkownik');
  const reason = interaction.options.getString('powod');
  const langOption = interaction.options.getString('jezyk');
  const lang = langOption === 'pl' ? 'pl' : 'en';
  const guildName = interaction.guild?.name ?? 'Nieznany serwer';

  if (!member) {
    return interaction.reply({
      content: 'Nie znaleziono użytkownika.',
      flags: 64,
    });
  }

  const warningData = await addWarning({
    guildId: interaction.guildId,
    guildName,
    member,
    reason,
    lang,
  });

  await interaction.reply({
    content:
      lang === 'pl'
        ? `# :warning: **${member}** otrzymałeś ostrzeżenie! Uzbieranie 3 ostrzeżeń skutkuje **BANEM!**\n` +
          `## Liczba ostrzeżeń: **${warningData.count}**\n` +
          `Powód: **${reason}**`
        : `# :warning: **${member}** You have been warned! Getting 3 warnings results in **BAN!**\n` +
          `## Warning count: **${warningData.count}**\n` +
          `Reason: **${reason}**`,
  });
}
