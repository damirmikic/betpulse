const API_URL = "https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer";

export async function fetchLeagues() {
  const res = await fetch(API_URL, {
    headers: {
      accept: "application/json",
      "X-API-Key": import.meta.env.VITE_CLOUDBET_API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch leagues");
  }

  return res.json();
}
