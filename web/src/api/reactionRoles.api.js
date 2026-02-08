import { apiFetch } from './client.js';

export async function createReactionRoles(data) {
  return apiFetch(`/api/reaction-roles`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
