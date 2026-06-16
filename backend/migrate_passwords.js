/**
 * migrate_passwords.js
 *
 * One-time migration script to hash all existing plain-text passwords
 * in local_db.json using bcrypt.
 *
 * Safe to run multiple times — skips users who already have password_hash.
 *
 * Usage:
 *   node migrate_passwords.js
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const BCRYPT_ROUNDS = 10;
const dbPath = path.resolve(__dirname, 'local_db.json');

async function migratePasswords() {
  console.log('=== Password Migration Script ===\n');

  if (!fs.existsSync(dbPath)) {
    console.error('Error: local_db.json not found at', dbPath);
    process.exit(1);
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const users = db.users || [];

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const user of users) {
    // Already hashed
    if (user.password_hash && !user.password) {
      console.log(`  ✓ ${user.email} — already hashed, skipping`);
      skipped++;
      continue;
    }

    // Has plain-text password that needs hashing
    if (user.password) {
      try {
        user.password_hash = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
        delete user.password;
        user.updated_at = new Date().toISOString();
        console.log(`  ✔ ${user.email} — migrated to bcrypt hash`);
        migrated++;
      } catch (err) {
        console.error(`  ✘ ${user.email} — failed:`, err.message);
        errors++;
      }
    } else {
      console.warn(`  ⚠ ${user.email} — no password or password_hash found`);
      errors++;
    }
  }

  // Write back
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  console.log(`\n=== Migration Complete ===`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped:  ${skipped}`);
  console.log(`  Errors:   ${errors}`);
  console.log(`  Total:    ${users.length}`);
}

migratePasswords().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
