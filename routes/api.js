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
//  data is sent as {
//     <team_id> : <user_id>
//  }
//where user_id is a member of the team's private channel. Currently set to my user_id in each channel.
router.route('/cron/clear')
    .post((req, res) => {
        cronClear(req.body)
            .then(message => res.send(message))
            .catch(err => res.send(err))
    })


module.exports = router