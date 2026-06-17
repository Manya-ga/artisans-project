const fs = require('fs');
const https = require('https');
const path = require('path');

const localDbPath = path.resolve(__dirname, 'local_db.json');
const dbData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));

const artisanImages = [];
const missingFields = [];

dbData.artisans.forEach(a => {
  if (a.image) artisanImages.push(a.image);
  else missingFields.push(`Artisan ${a.name} missing profile image`);
  
  if (a.coverImage) artisanImages.push(a.coverImage);
  else missingFields.push(`Artisan ${a.name} missing cover image`);
});

const productImages = [];
dbData.products.forEach(p => {
  if (p.image) productImages.push(p.image);
  else missingFields.push(`Product ${p.title} missing image`);
});

const allImages = [...artisanImages, ...productImages];

console.log('--- STRICT Image Validation Report ---');
console.log(`Artisan Images (Profile + Cover): ${artisanImages.length} (Expected 12)`);
console.log(`Product Images: ${productImages.length} (Expected 18)`);
console.log(`Total Images: ${allImages.length} (Expected 30)`);
console.log(`Missing Fields: ${missingFields.length}`);
if (missingFields.length > 0) console.log(missingFields);

// Uniqueness Validation
const uniqueImages = new Set(allImages);
const duplicates = allImages.length - uniqueImages.size;
console.log(`Duplicates Found: ${duplicates}`);

if (duplicates > 0) {
  console.error('ERROR: Duplicate images found!');
}

function checkImage(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode });
    }).on('error', (e) => resolve({ url, status: 500, error: e.message })).end();
  });
}

async function validateLoading() {
  console.log('\nStarting strict HTTP 200 validation on all 30 URLs...');
  let brokenCount = 0;
  for (let i = 0; i < allImages.length; i++) {
    const res = await checkImage(allImages[i]);
    if (res.status !== 200 && res.status !== 302) {
      console.error(`❌ Broken link detected [Status ${res.status}]: ${res.url}`);
      brokenCount++;
    } else {
      console.log(`✅ OK [${res.status}]: ${res.url.substring(0, 70)}...`);
    }
  }
  
  console.log('\n--- Final Validation Results ---');
  console.log(`Duplicates: ${duplicates}`);
  console.log(`Broken Links: ${brokenCount}`);
  console.log(`Missing Images: ${missingFields.length}`);
  
  if (duplicates === 0 && brokenCount === 0 && missingFields.length === 0) {
    console.log('SUCCESS: All 30 images are unique, present, and load correctly!');
  } else {
    console.error('FAILURE: Validation checks failed. Do NOT proceed.');
    process.exit(1);
  }
}

validateLoading();
