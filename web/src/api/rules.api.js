import { env } from '../../../src/config/env.js';
export async function createRules(data) {
  const response = await fetch(`${env.vite}/api/rules`, {
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
