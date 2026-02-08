import { env } from '../../../src/config/env.js';
export async function fetchConfig() {
  const res = await fetch(`${env.vite}/api/config`);
  return res.json();
}
