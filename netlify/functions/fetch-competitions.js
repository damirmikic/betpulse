// This function fetches the list of all available soccer competitions.
// Save this as 'fetch-competitions.js' in your 'netlify/functions' directory.

exports.handler = async () => {
  const apiKey = process.env.CLOUDBET_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." }),
    };
  }

  const apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Error fetching from Cloudbet API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from the sports API.' }),
    };
  }
};
