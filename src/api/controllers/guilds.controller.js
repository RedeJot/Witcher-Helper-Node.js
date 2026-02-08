import { client } from '../../bot/client.js';

// Pobieranie listy ról
export async function getGuildRoles(reg, res) {
  try {
    const { guildId } = reg.params;

    const guild = await client.guilds.fetch(guildId);
    const roles = await guild.roles.fetch();

    const sortedRoles = [...roles.values()]
      .filter((role) => role.name !== '@everyone' && !role.managed)
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        id: role.id,
        name: role.name,
      }));

    console.log(sortedRoles);
    res.json(sortedRoles);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Nie udało się pobrać ról',
    });
  }
}

// Pobieranie listy kanałów
export async function getGuildChannels(reg, res) {
  try {
    const { guildId } = reg.params;

    const guild = await client.guilds.fetch(guildId);
    const channels = await guild.channels.fetch();
    const sortedChannels = [...channels.values()]
      .filter((ch) => ch.isTextBased())
      .sort((a, b) => {
        if (a.parentId !== b.parentId) {
          return (a.parent?.position ?? 0) - (b.parent?.position ?? 0);
        }
        return a.position - b.position;
      })
      .map((ch) => ({
        id: ch.id,
        name: ch.parent ? `${ch.name}` : `${ch.name}`,
      }));

    res.json(sortedChannels);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Nie udało się pobrać kanałów',
    });
  }
}
