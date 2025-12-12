// netlify/functions/proxy.js

// 1. READ FROM ENVIRONMENT VARIABLE
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
        // Parse the last segment of the path
        const pathSegment = event.path.split('/').pop();
        
        // Parse query parameters (for from/to dates)
        const queryParams = event.queryStringParameters || {};
        
        let apiUrl;

        if (pathSegment === 'soccer') {
            // 1. List all competitions
            apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer`;
        } 
        else if (pathSegment === 'events') {
            // 2. Global Events Monitor (New)
            const { from, to } = queryParams;
            if (!from || !to) {
                throw new Error("Missing 'from' or 'to' parameters for events endpoint");
            }
            apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/events?sport=soccer&from=${from}&to=${to}&live=false&markets=soccer.match_odds&markets=soccer.total_goals&players=false&limit=500`;
        } 
        else {
            // 3. Specific Competition Events
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
