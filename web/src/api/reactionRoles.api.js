import { env } from '../../../src/config/env.js';
export async function createReactionRoles(data) {
  const response = await fetch(`${env.vite}/api/reaction-roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw json;
  }
  return json;
}
