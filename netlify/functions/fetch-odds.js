// This is your serverless function that will run on Netlify.
// It securely fetches data from the Cloudbet API.

exports.handler = async (event, context) => {
  // Get the API key from environment variables for security
  const apiKey = process.env.CLOUDBET_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key is not configured." }),
    };
  }

  // Calculate timestamps for 'now' and '7 days from now'
  const now = Math.floor(Date.now() / 1000);
  const sevenDaysFromNow = now + 7 * 24 * 60 * 60;

  // Construct the API URL with dynamic timestamps
  const apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/events?sport=soccer&from=${now}&to=${sevenDaysFromNow}&live=false&markets=soccer.match_odds&markets=soccer.total_goals&markets=soccer.total_goals_period_first_half&players=false&limit=1000`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
    });

    if (!response.ok) {
      // If the API returns an error, forward it
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `API error: ${response.statusText}` }),
      };
    }

    const data = await response.json();

    // Success! Return the data to the frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
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
