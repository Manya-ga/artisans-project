/**
 * User Model — Artisan Connect
 *
 * This project uses a local JSON file (local_db.json) as the database,
 * fronted by a Supabase-compatible mock client (src/config/supabase.js).
 *
 * The "users" collection stores authentication records with the following schema:
 *
 * @typedef {Object} User
 * @property {string}  id             - UUID primary key (auto-generated)
 * @property {string}  email          - Unique email address (lowercase, trimmed)
 * @property {string}  password_hash  - bcrypt-hashed password (never stored in plain text)
 * @property {Object}  user_metadata  - Additional metadata (e.g. { display_name })
 * @property {string}  created_at     - ISO 8601 timestamp of account creation
 * @property {string}  updated_at     - ISO 8601 timestamp of last modification
 *
 * The "profiles" collection stores user profile data:
 *
 * @typedef {Object} Profile
 * @property {string}   id            - UUID, matches users.id
 * @property {string}   email         - User email
 * @property {string}   display_name  - User's display name
 * @property {string}   role          - 'buyer' | 'artisan'
 * @property {string}   [bio]         - Bio text
 * @property {string}   [photo_url]   - Avatar URL
 * @property {string}   [location]    - User location
 * @property {string[]} [wishlist]    - Array of product IDs
 * @property {string[]} [followers]   - Array of user IDs
 * @property {string[]} [following]   - Array of user IDs
 * @property {string}   created_at    - ISO 8601 timestamp
 * @property {string}   updated_at    - ISO 8601 timestamp
 *
 * Note: The previous Mongoose schema in this file was dead code.
 * The project does NOT use MongoDB/Mongoose — it uses the Supabase mock.
 */

module.exports = {
  // Field names for reference in code
  FIELDS: {
    ID: 'id',
    EMAIL: 'email',
    PASSWORD_HASH: 'password_hash',
    USER_METADATA: 'user_metadata',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },

  PROFILE_FIELDS: {
    ID: 'id',
    EMAIL: 'email',
    DISPLAY_NAME: 'display_name',
    ROLE: 'role',
    BIO: 'bio',
    PHOTO_URL: 'photo_url',
    LOCATION: 'location',
    WISHLIST: 'wishlist',
    FOLLOWERS: 'followers',
    FOLLOWING: 'following',
    CREATED_AT: 'created_at',
    UPDATED_AT: 'updated_at',
  },

  ROLES: {
    BUYER: 'buyer',
    ARTISAN: 'artisan',
  },
};
