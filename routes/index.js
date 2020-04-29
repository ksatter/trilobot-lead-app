const apiRoutes = require('./api');
const oAuthRoutes = require('./oauth');
const url = require('url');

const router = require('express').Router();



router.use('/api', apiRoutes);
router.use('/oauth', oAuthRoutes);

router.get('/', (req, res) => {
    res.redirect(url.format({
        path: '/oauth',
        query: req.query
    }))
})

module.exports = router