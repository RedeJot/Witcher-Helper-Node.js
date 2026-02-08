export async function apiFetch(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // Czytamy body tylko raz i zapisujemy do zmiennej
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw { status: response.status, ...data };
  }

  return data;
}
