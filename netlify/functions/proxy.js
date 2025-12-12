// netlify/functions/proxy.js

// 1. READ FROM ENVIRONMENT VARIABLE
// If the variable is missing (e.g. local dev without setup), it logs a warning.
const API_KEY = process.env.CLOUDBET_API_KEY;

exports.handler = async (event, context) => {
    // 2. SAFETY CHECK
    if (!API_KEY) {
        console.error("Missing CLOUDBET_API_KEY environment variable");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Server configuration error: API Key missing" })
        };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const pathSegment = event.path.split('/').pop();
        let apiUrl;

        if (pathSegment === 'soccer') {
            apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer`;
        } else {
            apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/competitions/${pathSegment}?markets=soccer.match_odds&markets=soccer.total_goals&players=false&limit=50`;
        }
        
        const response = await fetch(apiUrl, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': API_KEY
            }
        });

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
