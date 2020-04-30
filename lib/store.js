const { WebClient } = require('@slack/web-api');
const { slack } = require('./keys')
const workspaces = require('./data')
const api = new WebClient()

//Used when logging leads in or out. 
//verifies that lead is a member of the lead channel and responds appropriately.
const checkAuth = (team, lead) => {
    return new Promise((resolve, reject) => {
        console.log(team.token)
        api.conversations.members({ channel: team.leadChannel, token: team.token })
        .then(res => resolve(res.members.includes(lead)))
        .catch(err => {
            console.log("Lead Authorization failed: ")
            console.log(err);
            reject()
        })
    })
}

//Used when viewing lead status.
//for each lead passed, gets status of lead and updates array element to include status
const updateLeads = (leads, team) => {
    const promises = leads.map((lead, i) => new Promise((resolve, reject) => {
        api.users.info({ user: lead.split('|')[0].substring(2), token:  team.token})
        .then(({user}) => {
            leads[i] += user.profile.status_text ? ` _${user.profile.status_text}_` : ''
            resolve()
        })
        .catch(err => {
            console.log('Lead update failed:');
            console.log(lead.split('|')[0].substring(3))
            console.log(leads, team)
            console.log(err)
            reject()
        })
    })
    )
    return Promise.all(promises)
}

//Used to set usable command based on user input.
//If command is "in" or "out", sets command to "lead" and status to true or false, respectively
//if a lead was tagged, it is stored as taggedLead (used for '/leads check @lead' and '/leads out @lead')
//If there is no command, defaults to "getLeads"
//Any other command sets command as "unknown"
const parseInput = ({ user_id, user_name, text, team_id }) => {
    const validCommands = ['clear', 'check']
    const textArr = text.split(" ")
    const commandText = textArr[0].trim().toLowerCase()

    const command = commandText === "in" || commandText === "out" ? "lead" : !commandText ? 'getLeads' : validCommands.includes(commandText) ? commandText : "unknown"
    return {
        lead: `<@${user_id}|${user_name}>`,
        taggedLead: textArr[1],
        command,
        status: textArr[0] === "in" || false,
        team: workspaces[team_id],
        user_id,
        commandText
    }
    
    
}

//Well... the thing that actually handles the commands. 
const commandHandler = {
    
    //triggered with `/leads in' and '/leads out'
    //checks authorization and resolves with appropriate message depending on whether command was 'in' or 'out'
    lead: ({ team, lead, taggedLead, user_id, status }) => {
        return new Promise((resolve, reject) => {
            checkAuth(team, user_id).then(authed => {
                console.log("in lead")
                team.leads[!status && taggedLead ? taggedLead : lead] = status;
                resolve(authed && (!taggedLead || (!status && taggedLead)) ? `${lead} logged ${taggedLead ? `${taggedLead} ` : ''}${status ? "in" : "out"} sucessfully` : `Access Denied`)
            }).catch(() => reject());
        })
    },
    
    //Triggered with '/leads' as well as any unknown command
    //Updates lead status and resolves with lead information
    getLeads: ({ team }) => {
        return new Promise((resolve, reject) => {

            const leads = Object.keys(team.leads).filter(lead => team.leads[lead]);
            updateLeads(leads, team)
                .then(() => resolve(leads.length ? `Lead${leads.length > 1 ? 's' : ''} on duty:\n\n${leads.map(lead => `\n${lead}`)}` : `No leads currently on duty`))
                .catch(() => reject())
        })
    },
    
    //Triggered with '/leads check @lead`
    //responds with status of specified lead or list of leads if not provided
    check: ({ taggedLead, team }) => {
        return new Promise((resolve, reject) => {
            console.log(taggedLead)
            if (taggedLead) {
                updateLeads([taggedLead], team)
                    .then(() => resolve(`${taggedLead} is ${!team.leads[taggedLead] ? 'not ' : ''}logged in`))
                    .catch(() => reject())
            } else {
                commandHandler.getLeads({ team })
                    .then(message => resolve(message))
                    .catch(() => reject())
            }
        })
    },
    
    //Triggered on '/leads clear'
    //removes all leads from leads list
    clear: ({ team, user_id }) => {
        return new Promise((resolve, reject) => {
            checkAuth(team, user_id).then(authed => {
                if (authed) {
                    team.leads = {};
                    resolve(`Lead List Cleared`)
                } else {
                    resolve('Access Denied')
                }
            }).catch(() => reject())
        })
    },
    
    //Triggered for any other command
    unknown: ({ commandText }) => {
        return new Promise((resolve, reject) => resolve(`Unknown command \`${commandText}\`.`))
    },
}

//Actual deported function. parses the request, runs the correct command and creates the response.
const buildMessage = (request) => {
    return new Promise((resolve, reject) => {
        const data = parseInput(request)
        commandHandler[data.command](data)
            .then(message => resolve(message))
            .catch(() => reject('An error occurred. Please contact <@UM5KSC672>'))
    })
}
module.exports = {buildMessage}