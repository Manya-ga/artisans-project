const google = require('googlethis');
const fs = require('fs');
const https = require('https');

const queries = [
  'traditional silk loom weaving artisan', 
  'pottery artist working on wheel', 
  'indian embroidery artisan woman working', 
  'colorful embroidery pattern fabric', 
  'pattachitra painting artist canvas', 
  'banarasi silk saree loom weaver'
];

function checkImage(url) {
  return new Promise((resolve) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function run() {
  const results = [];
  const options = { page: 0, safe: true };
  
  for (const q of queries) {
    try {
      const images = await google.image(q + ' filetype:jpg', options);
      let found = false;
      for (const img of images) {
        if (img.url.includes('unsplash') || img.url.includes('wikimedia') || img.url.includes('flickr') || img.url.includes('pexel')) {
           const isOk = await checkImage(img.url);
           if (isOk) {
             results.push(img.url);
             found = true;
             console.log("Found for:", q, img.url);
             break;
           }
        }
      }
      if (!found) {
        for (const img of images) {
           const isOk = await checkImage(img.url);
           if (isOk) {
             results.push(img.url);
             console.log("Found backup for:", q, img.url);
             break;
           }
        }
      }
    } catch (e) {
      console.error('Error for', q, e.message);
    }
  }
  
  fs.writeFileSync('new_artisan_images.json', JSON.stringify(results, null, 2));
  console.log('Saved to new_artisan_images.json');
}

run();
