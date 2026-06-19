const https = require('https');

const url = 'https://elkylzsyrktltvrftjgt.supabase.co/storage/v1/object/public/Images/catalog/new_qx3pbe_Agathi_Keerai.jpeg';

https.get(url, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  res.on('data', (chunk) => {
    // just consume data
  });
  res.on('end', () => {
    console.log('Finished reading response.');
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
