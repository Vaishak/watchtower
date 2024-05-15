import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import axios from 'axios';
import { cors } from 'hono/cors';
import { config } from 'dotenv';

config(); // Load environment variables from .env


const app = new Hono();

// Configure CORS to allow requests from the frontend
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST'],
}));

// Define the API endpoint
app.post('/api/dashboard', async (c) => {
  const requestBody = {
    parameters: {
      channel: 'fbi'
    },
    'max-age': 0
  };

  try {
    console.log("Request body: " + JSON.stringify(requestBody, null, 2));

    const response = await axios.post('https://data.hubs.neynar.com/api/queries/610/results', requestBody, {
      headers: {
        'Authorization': `Key ${process.env.API_KEY}`
      }
    });

    console.log("Response status code:", response.status);
    console.log("Response data:", response.data);

    return c.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.status, error.response?.data);
    return c.json({ error: 'Failed to fetch data' }, 500);
  }
});

// Serve the Hono app using Node's HTTP server
serve(app);

console.log('Server is running on http://localhost:3000');
