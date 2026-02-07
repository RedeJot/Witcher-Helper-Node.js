export async function fetchConfig() {
  const res = await fetch('http://localhost:3000/api/config');
  return res.json();
}
