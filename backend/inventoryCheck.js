const fs = require('fs');
const path = require('path');

const localDbPath = path.resolve(__dirname, 'local_db.json');
let dbData;
try {
  dbData = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));
} catch (e) {
  console.error("Failed to read local_db.json");
  process.exit(1);
}

const artisanImages = [];
const productImages = [];

console.log("=== STEP 1: IMAGE INVENTORY ===");
console.log("\n--- ARTISANS ---");
dbData.artisans.forEach(a => {
  console.log(JSON.stringify({
    name: a.name,
    profileImage: a.image || null,
    coverImage: a.coverImage || null
  }, null, 2));
  if (a.image) artisanImages.push(a.image);
  if (a.coverImage) artisanImages.push(a.coverImage);
});

console.log("\n--- PRODUCTS ---");
dbData.products.forEach(p => {
  console.log(JSON.stringify({
    name: p.title,
    image: p.image || null
  }, null, 2));
  if (p.image) productImages.push(p.image);
});

const allImages = [...artisanImages, ...productImages];
const uniqueImages = new Set(allImages);

console.log("\n=== STEP 2: FIND ALL PROBLEMS ===");
console.log(`Total Images Evaluated: ${allImages.length}`);
console.log(`Unique Images Found: ${uniqueImages.size}`);
console.log(`Duplicate Images: ${allImages.length - uniqueImages.size}`);

const emptyFields = dbData.artisans.filter(a => !a.image || !a.coverImage).length + dbData.products.filter(p => !p.image).length;
console.log(`Empty Fields Detected: ${emptyFields}`);

console.log("Validation complete.");
