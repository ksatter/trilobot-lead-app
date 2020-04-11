const apiRoutes = require('./api');
const oAuthRoutes = require('./oauth');

const router = require('express').Router();

router.get('*', (req, res) => {
    res.send("Nothing to see here, folks. Move it along.")
})

router.use('/api', apiRoutes);
router.use('/oauth', oAuthRoutes);


module.exports = router