const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const eventsController = require('./events.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', eventsController.listEvents);
router.post('/', eventsController.createEvent);

module.exports = router;
