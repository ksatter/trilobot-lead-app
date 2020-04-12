const router = require('express').Router();
const { WebClient } = require('@slack/web-api');
const {slack} = require('../lib/keys')

const api  = new WebClient(slack.botToken)
const leadList = require('../lib/data')

router.route('/lead/login')
    .post((req, res) => {
        api.conversations.members({channel: 'G0123HSNSFJ'})
            .then( channel => {
                if (channel.members.includes(req.body.user_id)) {
                    leadList[req.body.channel_id] = req.body.user_id;
                    console.log(leadList)
                    res.status(200).send(`You are now Lead on record for <#${req.body.channel_id}>`)
                } else {
                    res.status(200).send(`Access Denied`)
                }
            })
    })

router.route('/lead/logout')
.post((req, res) => {
    api.conversations.members({channel: 'G0123HSNSFJ'})
        .then( channel => {
            if (channel.members.includes(req.body.user_id)) {
                
                for (const channel in leadList) {
                    if (leadList[channel] === req.body.user_id) {
                        leadList[channel] = ""
                    }
                }

                res.status(200).send(`You are logged out on all channels`)
            } else {
                res.status(200).send(`Access Denied`)
            }
        })
})

router.route('/lead/which')
.post((req, res) => {
    api.conversations.members({channel: 'G0123HSNSFJ'})
        .then( channel => {

            const channelList = []
            if (channel.members.includes(req.body.user_id)) {
                
                for (const channel in leadList) {
                    if (leadList[channel] === req.body.user_id) {
                        channelList.push(leadList[channel]) 
                    }
                }

                res.status(200).send(channelList.length ? `You are logged in on: ${channelList.map(channel => `#${channel}`)}`:`You are logged out on all channels`)
            } else {
                res.status(200).send(`Access Denied`)
            }
        })
})

router.route('/leads')
    .post((req, res) => {
        console.log(req.body)
        const channelLead = leadList[req.body.channel_id]
        const allLeads = [...new Set([...Object.values(leadList)])].filter(lead => lead !== channelLead)
    
        res.status(200).send(
          (  channelLead ?
            `\nThe current lead for <#${req.body.channel_id}> is: <@${channelLead}>\n\n ` : '' ) +
            (allLeads.length ?  
            `${channelLead ? 'Also ' : `Lead${allLeads.length > 1 ? 's' : ''}`} on duty:\n\n` +
             allLeads.map(lead => `\n <@${lead}>`) : 'There are no leads currently on duty')
        )
    })


module.exports = router