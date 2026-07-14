const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const eventsController = require('./events.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', eventsController.listEvents);
router.post('/', eventsController.createEvent);
router.get('/:eventId', eventsController.getEvent);
router.patch('/:eventId', eventsController.updateEvent);
router.delete('/:eventId', eventsController.deleteEvent);

module.exports = router;
