const http = require('http');

const req = http.request(`${baseUrl}/api/auth/demo`, { method: 'POST' }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log("Login response:", data);
    const json = JSON.parse(data);
    
    if (json.token) {
      const req2 = http.request(`${baseUrl}/api/messages/conversations`, {
        headers: { 'Authorization': `Bearer ${json.token}` }
      }, (res2) => {
        let data2 = '';
        res2.on('data', chunk => data2 += chunk);
        res2.on('end', () => {
          console.log("Conversations status:", res2.statusCode);
          console.log("Conversations:", data2);
        });
      });
      req2.end();
    }
  });
});
req.end();
