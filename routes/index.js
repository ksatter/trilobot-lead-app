const apiRoutes = require('./api');
const oAuthRoutes = require('./oauth');

const router = require('express').Router();

router.use('/api', apiRoutes);
router.use('/oauth', oAuthRoutes);


module.exports = router