#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');

// city can be passed as args: node index.js "New York"
// or you can set a default CITY in a .env file
const city = process.argv.slice(2).join(' ') || process.env.CITY || 'London';
const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error('Error: OPENWEATHER_API_KEY is not set.');
  console.error('Options:');
  console.error('- Create a .env file with: OPENWEATHER_API_KEY=your_key');
  console.error('- Or set it in PowerShell: $env:OPENWEATHER_API_KEY = "your_key"');
  console.error('Then run: node index.js "City"');
  process.exit(1);
}

const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

axios.get(url)
  .then(res => {
    if (res && res.data && res.data.main && typeof res.data.main.temp !== 'undefined') {
      const temp = Math.round(res.data.main.temp);
      console.log(`temperature is ${temp} degree celsius`);
    } else {
      console.error('Unexpected API response format:', res.data);
      process.exit(2);
    }
  })
  .catch(err => {
    if (err.response && err.response.data) {
      console.error('API error:', err.response.data.message || err.response.statusText);
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(3);
  });
