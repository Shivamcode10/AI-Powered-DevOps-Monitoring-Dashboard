const BASE_URL = process.env.NEXT_PUBLIC_SYSTEM_API!;

export async function fetcher(endpoint: string) {
  const res = await fetch(`${BASE_URL}${endpoint}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("❌ API ERROR:", text);
    throw new Error(`Error fetching ${endpoint}`);
  }

  return res.json();
}