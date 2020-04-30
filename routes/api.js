const router = require('express').Router();

const {buildMessage, cronClear} = require('../lib/store')

//BOT ROUTES

router.route('/leads')
    .post((req, res) => {
        console.log(req.body)
        buildMessage(req.body)
            .then(message => res.status(200).send(message))
            .catch(message => res.status(200).send(message))
    })

//CRON ROUTES (cron-job.org)

//Server is pinged every 30 minutes from 9am to 12am CST to avoid idling in heroku.
router.route('/cron/sayhi')
    .get((req, res) => {
        res.send('Hello')
    })

//endpoint for auto-clear of lead list. Pinged daily at 1AM CST.
router.route('/cron/clear')
    .post((req, res) => {
        cronClear(req.body)
            .then(message => res.send(message))
    })

    
module.exports = router