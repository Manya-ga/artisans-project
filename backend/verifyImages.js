const https = require('https');

const ids = [
  // Assorted IDs that might be valid
  '1542330952650-efce130ebc18', '1620733723572-11c53f73a2ad', '1603415526960-f7e0328c63b1',
  '1584285423851-40e118c7a6e1', '1584589167171-541ce45f1eea', '1601000844782-b364de064438',
  '1596040033229-a9821ebd058d', '1589156229687-496a31ad1d1f', '1591851221711-50e4179d6756',
  '1555529902-5261145633bf', '1574634534894-89d7576c8259', '1546961342-9957252cb7ec',
  '1585515320310-259814833e62', '1605814597473-b3c9735d4ba2', '1506869640319-fea1a2ab8e9c',
  '1595085610896-bc316fb01b8e', '1523301343968-6a6ebf63c672', '1513360371669-4adf3dd7dff8',
  '1459411552884-841db9b3cc2a', '1490818387583-1b0ba687a7d2', '1461344577544-4a5dc9687e35',
  '1472506859345-d85c49615cb3', '1488184510005-728bafcc72db', '1500485035595-cbe6f6db1af5',
  '1502086223501-7ea6ecd79368', '1503676260728-1c00da094a0b', '1505330622000-bbf07aab54cb',
  '1505691938895-1758d7feb511', '1506012787146-f92b2d7d6d96', '1507206130118-b5907f817163'
];

async function checkUrl(id) {
  const url = `https://images.unsplash.com/photo-${id}?w=600&auto=format&fit=crop`;
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ id, status: res.statusCode, url });
    }).on('error', () => resolve({ id, status: 500, url })).end();
  });
}

async function run() {
  let validUrls = [];
  for (const id of ids) {
    const res = await checkUrl(id);
    if (res.status === 200) {
      validUrls.push(res.url);
    }
  }
  console.log('Valid URLs found:', validUrls.length);
  console.log(validUrls.slice(0, 24));
}
run();
