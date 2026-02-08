import { apiFetch } from './client.js'

// Klient API dla ról
export async function fetchGuildRoles(guildId) {
  return apiFetch(`/api/guilds/${guildId}/roles`);
}

// Klient API dla kanałów
export async function fetchGuildChannels(guildId) {
  return apiFetch(`/api/guilds/${guildId}/channels`);
}
