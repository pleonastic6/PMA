const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const placesController = require('./places.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/search', placesController.searchPlaces);

module.exports = router;
