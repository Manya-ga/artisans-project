const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const protect = require('../middleware/authMiddleware');

// Conversations
router.post('/conversations', protect, messageController.createConversation);
router.get('/conversations', protect, messageController.getConversations);
router.delete('/conversations/:conversationId', protect, messageController.deleteConversation);

// Messages within a conversation (by partner userId)
router.get('/:userId', protect, messageController.getMessages);

// Send a message (creates conversation if needed)
router.post('/', protect, messageController.sendMessage);
router.post('/send', protect, messageController.sendMessage);

module.exports = router;
