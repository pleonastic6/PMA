const express = require('express');
const router = express.Router();

const exampleRoutes = require('./example.routes');
const healthRoutes = require('./health.routes');
const authRoutes = require('../modules/auth/auth.routes');
const usersRoutes = require('../modules/users/users.routes');
const discoveryRoutes = require('../modules/discovery/discovery.routes');
const matchesRoutes = require('../modules/matches/matches.routes');
const chatRoutes = require('../modules/chat/chat.routes');
const eventsRoutes = require('../modules/events/events.routes');
const mapRoutes = require('../modules/map/map.routes');
const placesRoutes = require('../modules/places/places.routes');
// const userRotes = require('./users.routes');
// const productRoutes = require('./products.routes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/discovery', discoveryRoutes);
router.use('/matches', matchesRoutes);
router.use('/chat', chatRoutes);
router.use('/events', eventsRoutes);
router.use('/map', mapRoutes);
router.use('/places', placesRoutes);
router.use('/examples', exampleRoutes);
// router.use('/users', userRotes);
// router.use('/products', productRoutes);

module.exports = router;
