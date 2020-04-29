const router = require('express').Router();

const {buildMessage} = require('../lib/store')



router.route('/leads')
    .post((req, res) => {
        buildMessage(req.body).then(message => res.status(200).send(message));
    })


module.exports = router