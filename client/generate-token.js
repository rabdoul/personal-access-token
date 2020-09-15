const fetch = require('node-fetch');
const fs = require('fs');

const generateAccesToken = async () => {
  const token = Buffer.from('framboise@lectra.com:lectra').toString('base64');
  const response = await fetch('https://gateway-auth.cloudservices.dev.mylectra.com/auth/my-credentials', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clientId: 'LJiEVFKYyBMiDrKw4rCwUtOr7c7kr51P', audience: 'https://gateway-cuttingroom.dev.mylectra.com' })
  });
  const json = await response.json();
  fs.writeFile('.env', `REACT_APP_ACCESS_TOKEN=${json.access_token}`, error => {
    // eslint-disable-next-line no-console
    if (error) console.error(error);
  });
};

generateAccesToken();
