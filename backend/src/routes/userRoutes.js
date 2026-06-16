const express = require('express');
const { getArtisans, getUserById, toggleFollow } = require('../controllers/userController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch all artisans. We wrap it in a middleware that won't reject if unauthenticated,
// but will populate req.user if token is present, so we can exclude the current user.
const optionalAuth = (req, res, next) => {
  const hasToken = (req.cookies && req.cookies.token) ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer '));
  if (hasToken) {
    return authenticate(req, res, next);
  }
  next();
};

router.get('/artisans', optionalAuth, getArtisans);
router.get('/:id', optionalAuth, getUserById);
router.post('/:id/follow', authenticate, toggleFollow);

module.exports = router;
