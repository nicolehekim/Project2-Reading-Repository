const router = require('express').Router();
const userRoutes = require('./userRoutes');
const searchRoutes = require('./searchRoutes.js');

router.use('/users', userRoutes);
router.use('/search', searchRoutes);

module.exports = router;
