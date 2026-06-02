const express = require('express');
const router = express.Router();

const exampleRoutes = require('./example.routes');
// const userRotes = require('./users.routes');
// const productRoutes = require('./products.routes');

router.use('/examples', exampleRoutes);
// router.use('/users', userRotes);
// router.use('/products', productRoutes);

module.exports = router;