const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const mapController = require('./map.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/overview', mapController.overview);

module.exports = router;
