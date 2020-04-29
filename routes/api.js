const router = require('express').Router();

const store = require('../lib/store')



router.route('/leads')
    .post((req, res) => {

        let message = '';
        store.buildMessage(req.body).then(message => res.status(200).send(message));

        // if (command === "in" || command === "out" || command === "clear" || command === "status") {
        //     store.checkAuth(team)
        //         .then(channel => {
        //             if (channel.members.includes(user_id)) {
        //                 if (command === "in") {
        //                     team.leadList[lead] = true
        //                     message = `Logged ${lead} in successfully`
        //                 } else if (command === "out") {
        //                     team.leadList[lead] = false;
        //                     message = `Logged ${lead} out successfully`
        //                 } else if (command === "clear") {
        //                     team.leadList = {}
        //                     message = 'All leads logged out'
        //                 } else {
        //                     message = `${lead} is ${!team.leadList[lead] ? 'not ' : ''}logged in`
        //                 }
        //                 console.log(team.leadList)

        //             } else {
        //                 message = `Access Denied`
        //             }

        //             res.status(200).send(message)
        //         })
        //     return
        // } else if (command === "check") {
        //     const leads = [lead];
        //     store.updateLeads(leads).then(() => {
        //         message = textArr[1] ? `${leads[0]} is ${!team.leadList[lead] ? 'not' : ''} logged in as lead` : `Please tag a lead to check their status`
        //         res.status(200).send(message)
        //     })
            
        // } else if (command) {
        //     message = `Command \`${command}\` not recognized`
        // } else {
        //     const leads = Object.keys(team.leadList).filter((lead) => team.leadList[lead])
        //     store.updateLeads(leads).then(() => {
        //         console.log(leads)
        //         message = leads.length ? `Lead${leads.length > 1 ? 's' : ''} on Duty: \n\n ${leads.join('\n')}` : "There are no leads on duty"
        //         res.status(200).send(message)
        //     })
        // }


    })


module.exports = router