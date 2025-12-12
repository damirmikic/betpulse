// proxy-server.js - Run this on your backend to bypass CORS
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

const API_KEY = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IkhKcDkyNnF3ZXBjNnF3LU9rMk4zV05pXzBrRFd6cEdwTzAxNlRJUjdRWDAiLCJ0eXAiOiJKV1QifQ.eyJhY2Nlc3NfdGllciI6InRyYWRpbmciLCJleHAiOjIwNjE1Mzc1MDIsImlhdCI6MTc0NjE3NzUwMiwianRpIjoiNTU1ODk0NjgtZjJhZi00ZGQ3LWE3MTQtZjNiNjgyMWU4OGRkIiwic3ViIjoiOGYwYTk5YTEtNTFhZi00YzJlLWFlNDUtY2MxNjgwNDVjZTc3IiwidGVuYW50IjoiY2xvdWRiZXQiLCJ1dWlkIjoiOGYwYTk5YTEtNTFhZi00YzJlLWFlNDUtY2MxNjgwNDVjZTc3In0.BW_nXSwTkxTI7C-1UzgxWLnNzo9Bo1Ed8hI9RfVLnrJa6sfsMyvQ1NrtT5t6i_emwhkRHU1hY-9i6c2c5AI4fc2mRLSNBujvrfbVHX67uB58E8TeSOZUBRi0eqfLBL7sYl1JNPZzhFkDBCBNFJZJpn40FIjIrtIiPd-G5ClaaSMRWrFUDiwA1NmyxHSfkfRpeRSnfk15qck7zSIeNeITzPbD7kZGDIeStmcHuiHfcQX3NaHaI0gyw60wmDgan83NpYQYRVLQ9C4icbNhel4n5H5FGFAxQS8IcvynqV8f-vz2t4BRGuYXBU8uhdYKgezhyQrSvX6NpwNPBJC8CWo2fA';

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for competition odds
app.get('/api/odds/competitions/:competitionKey', async (req, res) => {
    try {
        const { competitionKey } = req.params;
        const { markets = 'soccer.match_odds,soccer.total_goals', players = 'false', limit = '50' } = req.query;
        
        const apiUrl = `https://sports-api.cloudbet.com/pub/v2/odds/competitions/${competitionKey}?markets=${markets}&players=${players}&limit=${limit}`;
        
        const response = await fetch(apiUrl, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Cloudbet API returned ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Proxy endpoint for all sports
app.get('/api/odds/sports/soccer', async (req, res) => {
    try {
        const apiUrl = 'https://sports-api.cloudbet.com/pub/v2/odds/sports/soccer';
        
        const response = await fetch(apiUrl, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`Cloudbet API returned ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log(`Use this in your app: http://localhost:${PORT}/api/odds/competitions/{competitionKey}`);
});

// Installation instructions:
// 1. npm init -y
// 2. npm install express cors node-fetch@2
// 3. node proxy-server.js
