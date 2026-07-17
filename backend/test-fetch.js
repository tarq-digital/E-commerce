const http = require('http');

http.get('http://localhost:8000/api/v1/store/home', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', data);
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
