const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const matchesController = require('./matches.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', matchesController.listMatches);
router.post('/swipe', matchesController.createSwipe);

module.exports = router;
