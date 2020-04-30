const router = require('express').Router();

const {buildMessage} = require('../lib/store')



router.route('/leads')
    .post((req, res) => {
        console.log(req.body)
        buildMessage(req.body)
            .then(message => res.status(200).send(message))
            .catch(message => res.status(200).send(message))
    })


module.exports = router