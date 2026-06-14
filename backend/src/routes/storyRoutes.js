const express = require('express');
const { getStories, createStory, deleteStory, getUserStories } = require('../controllers/storyController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', getStories);
router.get('/user/:userId', getUserStories);
router.post('/', authMiddleware, upload.array('media', 10), createStory);
router.delete('/:id', authMiddleware, deleteStory);

module.exports = router;
