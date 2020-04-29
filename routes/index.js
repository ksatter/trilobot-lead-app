const apiRoutes = require('./api');
const oAuthRoutes = require('./oauth');

const router = require('express').Router();



router.use('/api', apiRoutes);
router.use('/oauth', oAuthRoutes);

router.get('*', (req, res) => {
    res.send("Nothing to see here, folks. Move it along.")
})

module.exports = router