const { WebClient } = require('@slack/web-api');
const { slack } = require('./keys')
const workspaces = require('./data')
const api = new WebClient(slack.botToken)


const updateStatus = (response) => {
    const { status_text } = response.user.profile
    return status_text ? ` _${status_text}_` : ''
}

const checkAuth = (team, lead) => {
    return new Promise((resolve, reject) => {
        console.log(team.leadChannel)
        api.conversations.members({ channel: team.leadChannel })
            .then(res => resolve(res.members.includes(lead)))
    }).catch(err => console.log(err))
}

const updateLeads = (leads) => {
    const promises = leads.map((lead, i) => new Promise((resolve, reject) => {
        api.users.info({ user: lead.split('|')[0].substring(2) })
            .then(response => {
                leads[i] += updateStatus(response)
                resolve()
            })
            .catch(err => reject(err))
        })
    )
    return Promise.all(promises)
}
const getWorkspace = (team) => {
    return workspaces[team]
}

const parseCommand = (commandText) => {
    const validCommands = ['clear', 'check']
    return commandText === "in" || commandText === "out" ? "lead" : !commandText ? 'getLeads' : validCommands.includes(commandText) ? commandText : "unknown"
}

const commandHandler = {
    lead: ({ team, lead, taggedLead, user_id, status }) => {
        return new Promise((resolve, reject) => {
            console.log(team)
            checkAuth(team, user_id).then(authed => {
                team.leads[!status && taggedLead ? taggedLead : lead] = status;
                resolve(authed && (!taggedLead || (!status && taggedLead)) ? `${lead} logged ${taggedLead ? `${taggedLead} ` : ''}${status ? "in" : "out"} sucessfully` : `Access Denied`)
            });
        })
    },

    getLeads: ({ team }) => {
        return new Promise((resolve, reject) => {

            const leads = Object.keys(team.leads).filter((lead) => team.leads[lead]);
            updateLeads(leads).then(() => resolve(leads.length ? `Lead${leads.length > 1 ? 's' : ''} on duty:\n\n${leads.map(lead => `\n${lead}`)}` : `No leads currently on duty`))
            
        })
    },

    check: ({ taggedLead, team }) => {
        return new Promise((resolve, reject) => {
            if (taggedLead) {
                updateLeads([taggedLead]).then(() => resolve(`${taggedLead} is ${!team.leads[taggedLead] ? 'not' : ''} logged in`))
            } else {
                commandHandler.getLeads({ team }).then(message => resolve(message))
            }
        })
    },

    clear: ({ team, user_id }) => {
        return new Promise((resolve, reject) => {
            checkAuth(team, user_id).then(authed => {
                if (authed) {
                    team.leads = {};
                    resolve(`Lead List Cleared`)
                } else {
                    resolve('Access Denied')
                }
            })
        })
    },

    unknown: ({ commandText }) => {
        return new Promise((resolve, reject) => resolve(`Unknown command \`${commandText}\`.`))
    },
}

const buildMessage = ({ user_id, user_name, text, team_id, token }) => {
    return new Promise((resolve, reject) => {
        const textArr = text.split(" ")
        const commandText = textArr[0].trim().toLowerCase()
        const data = {
            lead: `<@${user_id}|${user_name}>`,
            taggedLead: textArr[1],
            command: parseCommand(commandText),
            status: textArr[0] === "in" || false,
            team: getWorkspace(team_id),
            user_id,
            commandText
        }
        commandHandler[data.command](data).then(message => resolve(message))

    })
}
module.exports = {buildMessage}