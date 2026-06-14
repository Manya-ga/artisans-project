const express = require('express');
const { getArtisans, getArtisanById } = require('../controllers/artisanController');

const router = express.Router();
router.get('/', getArtisans);
router.get('/:id', getArtisanById);

module.exports = router;
