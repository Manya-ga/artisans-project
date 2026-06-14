const fs = require('fs');
const path = require('path');
const multer = require('multer');
const supabase = require('../config/supabase');

const useSupabaseStorage = Boolean(
  process.env.SUPABASE_URL &&
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ALWAYS use diskStorage so we have the file on disk (for fallback or to read buffer from)
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_.]/g, '');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const storage = diskStorage;

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Only image and video files are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// Helper to upload to Supabase Storage
upload.uploadToSupabase = async (file, bucket = 'artisan-connect') => {
  if (!useSupabaseStorage) return null;

  try {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    
    // Read the file buffer from the local disk path where multer saved it
    const fileBuffer = fs.readFileSync(file.path);

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.error('Error uploading to Supabase:', err);
    return null;
  }
};

module.exports = upload;
