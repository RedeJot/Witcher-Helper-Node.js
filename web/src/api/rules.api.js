export async function createRules(data) {
  const response = await fetch('http://localhost:3000/api/rules', {
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