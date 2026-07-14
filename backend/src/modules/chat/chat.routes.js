const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const chatController = require('./chat.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/conversations', chatController.listConversations);
router.get('/:userId/messages', chatController.listMessages);
router.post('/:userId/messages', chatController.sendMessage);
router.delete('/:userId/messages', chatController.deleteConversation);

module.exports = router;
