const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const usersController = require('./users.controller');

const router = express.Router();

router.use(requireAuth);

router.get('/me', usersController.me);
router.patch('/me', usersController.updateMe);
router.patch('/me/preferences', usersController.updatePreferences);

module.exports = router;
