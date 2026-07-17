const http = require('http');

['/api/v1/health', '/api/v1/store/home'].forEach(path => {
  http.get(`http://localhost:8000${path}`, (res) => {
    console.log(`${path} -> Status:`, res.statusCode);
  }).on('error', err => {
    console.log(`${path} -> Error:`, err.message);
  });
});
