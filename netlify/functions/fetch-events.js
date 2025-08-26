// This function fetches the events (matches) for a specific competition key.

exports.handler = async (event) => {
  const apiKey = process.env.CLOUDBET_API_KEY;
  const { competitionKey } = event.queryStringParameters;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." }),
    };
  }

  if (!competitionKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'competitionKey' parameter." }),
    };
  }

  const apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/competitions/${competitionKey}?players=false&limit=100`;

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
