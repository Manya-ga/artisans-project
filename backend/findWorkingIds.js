const https = require('https');
const fs = require('fs');

// A list of some well-known, highly reliable Unsplash IDs for crafts/textures
const candidates = [
  '1584285423851-40e118c7a6e1', // Kutch embroidery
  '1584589167171-541ce45f1eea', // Pattachitra painter
  '1601000844782-b364de064438', // Banarasi weaver
  '1542330952650-efce130ebc18', // Wooden toy
  '1555529902-5261145633bf', // Silk
  '1506869640319-fea1a2ab8e9c', // Pottery
  '1595085610896-bc316fb01b8e', // Vase
  '1490818387583-1b0ba687a7d2', // Tapestry
  '1461344577544-4a5dc9687e35', // Painting
  '1472506859345-d85c49615cb3', // Bookmark
  '1488184510005-728bafcc72db', // Canvas
  '1500485035595-cbe6f6db1af5', // Saree
  // Let's try some standard reliable stock IDs for textures/crafts:
  '1605806616949-1e87b487cb2a',
  '1501004318641-b39e6451bec6',
  '1618220179428-22790b46a011',
  '1513519245088-0e12902e5a38',
  '1528458909336-9e115fd8b122',
  '1513519245088-0e12902e5a38',
  '1459411552884-841db9b3cc2a'
];

async function check(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=800&auto=format&fit=crop`;
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ id, status: res.statusCode });
    }).on('error', () => resolve({ id, status: 500 })).end();
  });
}

async function run() {
  const working = [];
  for (const id of candidates) {
    const res = await check(id);
    if (res.status === 200 || res.status === 302) {
      working.push(id);
    }
  }
  console.log("WORKING IDs:", working);
}
run();
