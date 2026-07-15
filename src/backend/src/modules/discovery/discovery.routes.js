const express = require('express');
const { requireAuth } = require('../../common/middleware/auth.middleware');
const discoveryController = require('./discovery.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', discoveryController.listCandidates);

module.exports = router;
