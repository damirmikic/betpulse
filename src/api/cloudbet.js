const API_BASE_URL = "https://sports-api.cloudbet.com/pub/v2/odds";
const FIFTEEN_DAYS_IN_SECONDS = 15 * 24 * 60 * 60;

function buildHeaders() {
  return {
    accept: "application/json",
    "X-API-Key": import.meta.env.VITE_CLOUDBET_API_KEY,
  };
}

async function requestJson(url) {
  const res = await fetch(url, {
    headers: buildHeaders(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data from Cloudbet");
  }

  return res.json();
}

export async function fetchLeagues() {
  return requestJson(`${API_BASE_URL}/sports/soccer`);
}

export async function fetchCompetitionEvents(competitionKey, options = {}) {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const from = options.from ?? nowInSeconds;
  const to = options.to ?? from + FIFTEEN_DAYS_IN_SECONDS;
  const limit = options.limit ?? 50;
  const players = options.players ?? false;

  const params = new URLSearchParams({
    from: String(from),
    to: String(to),
    limit: String(limit),
    players: String(players),
  });

  return requestJson(`${API_BASE_URL}/competitions/${competitionKey}?${params}`);
}
