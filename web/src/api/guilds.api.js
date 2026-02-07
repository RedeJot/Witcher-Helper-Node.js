// Klient API dla ról
export async function fetchGuildRoles(guildId) {
  const res = await fetch(`http://localhost:3000/api/guilds/${guildId}/roles`);
  if (!res.ok) {
    throw new Error('Nie udało się pobrać listy ról');
  }

  return res.json();
}

// Klient API dla kanałów
export async function fetchGuildChannels(guildId) {
  const res = await fetch(
    `http://localhost:3000/api/guilds/${guildId}/channels`,
  );

  if (!res.ok) {
    throw new Error('Nie udało się pobrać listy kanałów');
  }

  return res.json();
}
