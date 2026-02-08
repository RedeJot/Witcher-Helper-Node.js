import { apiFetch } from './client.js';
export async function fetchConfig() {
  return apiFetch('/api/config');
}
