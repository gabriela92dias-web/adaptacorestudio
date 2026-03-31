const fs = require('fs');

const API_KEY = 'fa0ba7e4-c271-4174-b2db-6fce4bac7418:0fcb76112eac241c5ae92199a1299f99c178f81e4d3b829137020aee07c976bd';

async function getMockups() {
  try {
    const url = 'https://app.dynamicmockups.com/api/v1/mockups';
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY, 
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    fs.writeFileSync('mockups.json', JSON.stringify(data, null, 2));
  } catch(e) {
    console.error('Fetch error:', e);
  }
}

getMockups();
