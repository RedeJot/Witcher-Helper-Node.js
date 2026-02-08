import { apiFetch } from './client.js';

export async function createRules(data) {
  return apiFetch(`/api/rules`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
