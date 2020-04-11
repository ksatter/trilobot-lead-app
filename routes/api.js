const router = require('express').Router();
const { WebClient } = require('@slack/web-api');
const {slack} = require('../lib/keys')

const api  = new WebClient(slack.botToken)
const leadList = require('../lib/data')

router.route('/lead/login')
    .post((req, res) => {
        api.conversations.members({channel: 'G0123HSNSFJ'}).then(res => console.log(res))

        leadList[req.body.channel_id] = req.body.user_name;
        console.log(leadList)
        res.status(200).send(`You are now Lead on record for <#${req.body.channel_id}>`)
    })

router.route('/leads')
    .post((req, res) => {
        console.log(req.body)
        res.status(200).send(
            leadList[req.body.channel_id] ?
            `The current lead for <@${req.body.channel_id}> is: <@${leadList[req.body.channel_id]}>` : null +
            Object.values(leadList).length > 1 ?  
            `\n\n Leads on duty:` +
             Object.values(Leadlist).map(leads => `\n <@${lead}>`) : 'There are no leads currently on duty'
        )
    })

module.exports = router