const express = require('express');
const router = express.Router();
const exampleController = require('../controllers/example.controller');

router.get('/', exampleController.getExampleData);
router.post('/', exampleController.createExample);

module.exports = router;