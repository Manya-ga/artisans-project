const http = require('http');

http.get('http://127.0.0.1:5000/api/products?page=2&limit=2', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Pagination Metadata Check:");
      console.log(`page: ${parsed.page} (type: ${typeof parsed.page})`);
      console.log(`limit: ${parsed.limit}`);
      console.log(`totalPages: ${parsed.totalPages}`);
      console.log(`totalItems: ${parsed.totalItems}`);
      console.log(`hasNext: ${parsed.hasNext}`);
      console.log(`hasPrevious: ${parsed.hasPrevious}`);
      
      const success = (
        typeof parsed.page === 'number' &&
        typeof parsed.limit === 'number' &&
        typeof parsed.totalItems === 'number' &&
        typeof parsed.hasNext === 'boolean' &&
        typeof parsed.hasPrevious === 'boolean'
      );
      console.log(`Validation Passed: ${success}`);
    } catch (e) {
      console.error("Failed to parse response:", data, e);
    }
  });
}).on('error', (err) => {
  console.error("HTTP Request Failed:", err);
});
